import { getSupabaseAdmin } from "./supabase";
import { Assignment, Course, seedAssignments, seedCourses } from "./semester";

export type DashboardData = {
  courses: Course[];
  assignments: Assignment[];
  lastSyncAt: string | null;
  source: "supabase" | "seed";
};

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      courses: seedCourses,
      assignments: seedAssignments,
      lastSyncAt: null,
      source: "seed",
    };
  }

  const [coursesResult, assignmentsResult, syncResult] = await Promise.all([
    supabase.from("courses").select("*").order("starts_on", { ascending: true }),
    supabase
      .from("assignments")
      .select("*")
      .neq("status", "GRADED")
      .neq("status", "CANVAS_CONFIRMED")
      .order("due_at", { ascending: true, nullsFirst: false }),
    supabase
      .from("sync_runs")
      .select("finished_at")
      .order("finished_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (coursesResult.error || assignmentsResult.error) {
    return {
      courses: seedCourses,
      assignments: seedAssignments,
      lastSyncAt: null,
      source: "seed",
    };
  }

  return {
    courses: coursesResult.data as Course[],
    assignments: assignmentsResult.data as Assignment[],
    lastSyncAt: syncResult.data?.finished_at ?? null,
    source: "supabase",
  };
}
