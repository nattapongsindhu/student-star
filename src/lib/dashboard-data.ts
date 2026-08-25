import { getSupabaseAdmin } from "./supabase";
import { isCanvasTokenExpiredError } from "./canvas-sync";
import { seedAssignments, seedCourses } from "./semester";
import type { CanvasSyncStatus } from "./canvas-sync";
import type { Assignment, Course } from "./semester";

export type DashboardData = {
  courses: Course[];
  assignments: Assignment[];
  courseAssignments: Assignment[];
  lastSyncAt: string | null;
  lastAttemptAt: string | null;
  syncStatus: CanvasSyncStatus;
  source: "supabase" | "seed";
};

type SyncRunRow = {
  status: string;
  error_message: string | null;
  finished_at: string;
};

function statusFromSyncRun(run: SyncRunRow | null | undefined): CanvasSyncStatus {
  if (!run) {
    return "ok";
  }

  if (run.status === "token_expired" || isCanvasTokenExpiredError(new Error(run.error_message ?? run.status))) {
    return "token_expired";
  }

  if (run.status === "failed") {
    return "sync_failed";
  }

  return "ok";
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      courses: seedCourses,
      assignments: seedAssignments,
      courseAssignments: seedAssignments,
      lastSyncAt: null,
      lastAttemptAt: null,
      syncStatus: "ok",
      source: "seed",
    };
  }

  const [coursesResult, assignmentsResult, courseAssignmentsResult, latestSyncResult, successfulSyncResult] = await Promise.all([
    supabase.from("courses").select("*").order("starts_on", { ascending: true }),
    supabase
      .from("assignments")
      .select("*")
      .neq("status", "GRADED")
      .neq("status", "CANVAS_CONFIRMED")
      .order("due_at", { ascending: true, nullsFirst: false }),
    supabase.from("assignments").select("*").order("due_at", { ascending: true, nullsFirst: false }),
    supabase
      .from("sync_runs")
      .select("status, error_message, finished_at")
      .order("finished_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("sync_runs")
      .select("finished_at")
      .eq("status", "success")
      .order("finished_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (coursesResult.error || assignmentsResult.error) {
    return {
      courses: seedCourses,
      assignments: seedAssignments,
      courseAssignments: seedAssignments,
      lastSyncAt: null,
      lastAttemptAt: null,
      syncStatus: "sync_failed",
      source: "seed",
    };
  }

  const latestSync = latestSyncResult.data as SyncRunRow | null;

  return {
    courses: coursesResult.data as Course[],
    assignments: assignmentsResult.data as Assignment[],
    courseAssignments: (courseAssignmentsResult.data ?? assignmentsResult.data) as Assignment[],
    lastSyncAt: successfulSyncResult.data?.finished_at ?? null,
    lastAttemptAt: latestSync?.finished_at ?? successfulSyncResult.data?.finished_at ?? null,
    syncStatus: statusFromSyncRun(latestSync),
    source: "supabase",
  };
}
