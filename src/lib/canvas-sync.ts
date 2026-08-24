import { getSupabaseAdmin } from "./supabase";
import { TaskStatus, TaskType } from "@/types/academic";
import { AssignmentSnapshot } from "@/types/sync";
import { detectAssignmentChanges } from "./change-detection";
import { calculateAssignmentRisk } from "./risk-engine";
import { seedCourses } from "./semester";

export type CanvasSyncStatus = "ok" | "token_expired" | "sync_failed";

export type CanvasSyncFailure = {
  syncStatus: Exclude<CanvasSyncStatus, "ok">;
  lastAttempt: string;
  message: string;
  runStatus: "token_expired" | "failed";
};

export class CanvasApiError extends Error {
  constructor(
    readonly status: number,
    readonly statusText: string,
  ) {
    super(`Canvas API failed: ${status} ${statusText}`);
    this.name = "CanvasApiError";
  }
}

type CanvasCourse = {
  id: number;
  name?: string;
  course_code?: string;
  workflow_state?: string;
};

type CanvasAssignment = {
  id: number;
  name: string;
  html_url?: string;
  due_at: string | null;
  points_possible: number | null;
  submission?: {
    submitted_at?: string | null;
    graded_at?: string | null;
    score?: number | null;
  };
  submission_types?: string[];
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

export function isCanvasTokenExpiredError(error: unknown) {
  if (error instanceof CanvasApiError && error.status === 401) {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);
  return /(401|unauthorized|invalid token|expired token|token.*expired|token.*invalid)/i.test(message);
}

export function getCanvasSyncFailure(error: unknown, lastAttempt = new Date().toISOString()): CanvasSyncFailure {
  const tokenExpired = isCanvasTokenExpiredError(error);
  const message = error instanceof Error ? error.message : "Unknown sync error";

  return {
    syncStatus: tokenExpired ? "token_expired" : "sync_failed",
    lastAttempt,
    message,
    runStatus: tokenExpired ? "token_expired" : "failed",
  };
}

export async function recordCanvasSyncFailure(error: unknown) {
  const failure = getCanvasSyncFailure(error);
  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase.from("sync_runs").insert({
      source: "canvas",
      status: failure.runStatus,
      error_message: failure.message,
      started_at: failure.lastAttempt,
      finished_at: failure.lastAttempt,
    });
  }

  return failure;
}

async function canvasGet<T>(path: string): Promise<T[]> {
  const baseUrl = requireEnv("CANVAS_BASE_URL").replace(/\/$/, "");
  const token = requireEnv("CANVAS_ACCESS_TOKEN");
  const results: T[] = [];
  let url: string | null = `${baseUrl}${path}${path.includes("?") ? "&" : "?"}per_page=100`;

  while (url) {
    const response: Response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      throw new CanvasApiError(response.status, response.statusText || "Unauthorized");
    }

    if (!response.ok) {
      throw new CanvasApiError(response.status, response.statusText || "Unknown error");
    }

    results.push(...((await response.json()) as T[]));
    const link: string | null = response.headers.get("link");
    const next: string | undefined = link
      ?.split(",")
      .map((part: string) => part.trim())
      .find((part: string) => part.includes('rel="next"'));
    url = next?.match(/<([^>]+)>/)?.[1] ?? null;
  }

  return results;
}

function estimateMinutes(assignment: CanvasAssignment) {
  const name = assignment.name.toLowerCase();
  if (name.includes("lab") || name.includes("project") || name.includes("report")) return 180;
  if (name.includes("discussion") || name.includes("essay") || name.includes("writing")) return 120;
  if (name.includes("quiz")) return 60;
  return 90;
}

function taskType(assignment: CanvasAssignment): TaskType {
  const name = assignment.name.toLowerCase();
  if (name.includes("lab")) return "lab";
  if (name.includes("discussion")) return "discussion";
  if (name.includes("quiz") || assignment.submission_types?.includes("online_quiz")) return "quiz";
  if (name.includes("essay")) return "essay";
  if (name.includes("paper") || name.includes("writing")) return "paper";
  if (name.includes("project") || name.includes("report")) return "project";
  return "reading";
}

function statusFor(assignment: CanvasAssignment): TaskStatus {
  if (assignment.submission?.graded_at) return "GRADED";
  if (assignment.submission?.submitted_at) return "CANVAS_CONFIRMED";
  return "DISCOVERED";
}

function courseMatch(course: CanvasCourse, code: string) {
  const haystack = `${course.course_code ?? ""} ${course.name ?? ""}`.toLowerCase();
  const normalizedCode = code.toLowerCase().replace(/[^a-z0-9]/g, "");
  return haystack.replace(/[^a-z0-9]/g, "").includes(normalizedCode);
}

async function resolveCourses() {
  const configured = process.env.CANVAS_COURSE_IDS?.split(",")
    .map((id) => Number(id.trim()))
    .filter(Boolean);

  if (configured?.length) {
    return configured.map((canvasId) => ({ canvasId, seed: null }));
  }

  const activeCourses = await canvasGet<CanvasCourse>("/api/v1/courses?include[]=term");
  return seedCourses
    .map((seed) => {
      const match = activeCourses.find((course) => courseMatch(course, seed.code));
      return match ? { canvasId: match.id, seed } : null;
    })
    .filter(Boolean) as { canvasId: number; seed: (typeof seedCourses)[number] }[];
}

async function upsertSeedCourses() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase service role environment variables are not configured.");
  }

  const { error } = await supabase.from("courses").upsert(
    seedCourses.map((course) => ({
      id: course.id,
      canvas_course_id: course.canvas_course_id,
      code: course.code,
      title: course.title,
      term_label: course.term_label,
      course_status: course.course_status,
      campus: course.campus,
      modality: course.modality,
      units: course.units,
      final_grade: course.final_grade,
      starts_on: course.starts_on,
      ends_on: course.ends_on,
      weekly_hours: course.weekly_hours,
      color: course.color,
      source: course.source,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: "id" },
  );

  if (error) throw error;
}

export async function syncCanvasToSupabase() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase service role environment variables are not configured.");
  }

  await upsertSeedCourses();
  const courses = await resolveCourses();
  let assignmentCount = 0;
  let changeCount = 0;
  const startedAt = new Date().toISOString();

  for (const item of courses) {
    const seed = item.seed;
    const fallbackSeed = seedCourses.find((course) => course.canvas_course_id === item.canvasId);
    const course = seed ?? fallbackSeed;

    const courseId = course?.id ?? `canvas-${item.canvasId}`;
    await supabase.from("courses").upsert(
      {
        id: courseId,
        canvas_course_id: item.canvasId,
        code: course?.code ?? `Canvas ${item.canvasId}`,
        title: course?.title ?? "Canvas Course",
        term_label: course?.term_label ?? "Canvas",
        course_status: course?.course_status ?? "active",
        campus: course?.campus ?? "Canvas",
        modality: course?.modality ?? "Online",
        units: course?.units ?? 3,
        final_grade: course?.final_grade ?? null,
        starts_on: course?.starts_on ?? "2026-08-31",
        ends_on: course?.ends_on ?? "2026-12-20",
        weekly_hours: course?.weekly_hours ?? 4,
        color: course?.color ?? "#334155",
        source: "canvas",
      },
      { onConflict: "id" },
    );

    const assignments = await canvasGet<CanvasAssignment>(
      `/api/v1/courses/${item.canvasId}/assignments?include[]=submission`,
    );

    const assignmentIds = assignments.map((assignment) => `${courseId}-${assignment.id}`);
    const { data: existingAssignments, error: existingError } = await supabase
      .from("assignments")
      .select("id, course_id, title, due_at, points_possible, status, canvas_submission_confirmed")
      .in("id", assignmentIds);

    if (existingError) throw existingError;

    const existingById = new Map(
      (existingAssignments as AssignmentSnapshot[] | null | undefined)?.map((assignment) => [assignment.id, assignment]) ?? [],
    );
    const pendingChanges: ReturnType<typeof detectAssignmentChanges> = [];

    const rows = assignments.map((assignment) => {
      const estimatedMinutes = estimateMinutes(assignment);
      const status = statusFor(assignment);
      const canvasSubmissionConfirmed = status === "CANVAS_CONFIRMED" || status === "GRADED";
      const risk = calculateAssignmentRisk({
        dueAt: assignment.due_at,
        pointsPossible: assignment.points_possible,
        estimatedMinutes,
        progressPercent: canvasSubmissionConfirmed ? 100 : 0,
        status,
        difficulty: estimatedMinutes >= 180 ? "heavy" : estimatedMinutes >= 120 ? "medium" : "light",
        courseGradePercent: null,
        aSafetyMargin: null,
        isAcceleratedCourse: courseId === "asian-001" || courseId === "cs-119",
        canvasSubmissionConfirmed,
      });

      const row = {
        id: `${courseId}-${assignment.id}`,
        course_id: courseId,
        canvas_assignment_id: assignment.id,
        title: assignment.name,
        due_at: assignment.due_at,
        status,
        points_possible: assignment.points_possible,
        estimated_minutes: estimatedMinutes,
        difficulty: estimatedMinutes >= 180 ? "heavy" : estimatedMinutes >= 120 ? "medium" : "light",
        task_type: taskType(assignment),
        priority_score: risk.score,
        risk_level: risk.level,
        progress_percent: canvasSubmissionConfirmed ? 100 : 0,
        canvas_submission_confirmed: canvasSubmissionConfirmed,
        notes: null,
        url: assignment.html_url ?? null,
        source: "canvas",
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      pendingChanges.push(...detectAssignmentChanges(existingById.get(row.id) ?? null, row));
      return row;
    });

    if (rows.length) {
      const { error } = await supabase.from("assignments").upsert(rows, { onConflict: "id" });
      if (error) throw error;
    }

    if (pendingChanges.length) {
      const { error } = await supabase
        .from("change_events")
        .upsert(pendingChanges, { onConflict: "event_key", ignoreDuplicates: true });
      if (error) throw error;
      changeCount += pendingChanges.length;
    }

    assignmentCount += rows.length;
  }

  const finishedAt = new Date().toISOString();

  await supabase.from("sync_runs").insert({
    source: "canvas",
    status: "success",
    courses_seen: courses.length,
    assignments_seen: assignmentCount,
    changes_seen: changeCount,
    started_at: startedAt,
    finished_at: finishedAt,
  });

  return {
    syncStatus: "ok" as const,
    lastSynced: finishedAt,
    coursesSeen: courses.length,
    assignmentsSeen: assignmentCount,
    changesSeen: changeCount,
  };
}
