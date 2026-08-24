import { getSupabaseAdmin } from "./supabase";

export type SyncRun = {
  id: string;
  source: string;
  status: string;
  courses_seen: number;
  assignments_seen: number;
  changes_seen: number;
  error_message: string | null;
  started_at: string;
  finished_at: string;
};

export type ChangeEvent = {
  id: string;
  course_id: string | null;
  assignment_id: string | null;
  event_type: string;
  severity: "info" | "watch" | "important" | "critical";
  title: string;
  previous_value: string | null;
  new_value: string | null;
  detected_at: string;
};

export type SyncDashboardData = {
  configured: {
    supabase: boolean;
    canvasBaseUrl: boolean;
    canvasToken: boolean;
    cronSecret: boolean;
  };
  syncRuns: SyncRun[];
  changes: ChangeEvent[];
};

export async function getSyncDashboardData(): Promise<SyncDashboardData> {
  const configured = {
    supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    canvasBaseUrl: Boolean(process.env.CANVAS_BASE_URL),
    canvasToken: Boolean(process.env.CANVAS_ACCESS_TOKEN),
    cronSecret: Boolean(process.env.CRON_SECRET),
  };
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      configured,
      syncRuns: [],
      changes: [],
    };
  }

  const [syncRunsResult, changesResult] = await Promise.all([
    supabase
      .from("sync_runs")
      .select("id, source, status, courses_seen, assignments_seen, changes_seen, error_message, started_at, finished_at")
      .order("finished_at", { ascending: false })
      .limit(10),
    supabase
      .from("change_events")
      .select("id, course_id, assignment_id, event_type, severity, title, previous_value, new_value, detected_at")
      .order("detected_at", { ascending: false })
      .limit(12),
  ]);

  return {
    configured,
    syncRuns: (syncRunsResult.data ?? []) as SyncRun[],
    changes: (changesResult.data ?? []) as ChangeEvent[],
  };
}
