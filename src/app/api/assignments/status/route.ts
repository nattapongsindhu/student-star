import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { TaskStatus } from "@/types/academic";

const taskStatuses = [
  "DISCOVERED",
  "ACKNOWLEDGED",
  "STARTED",
  "READY_FOR_AUDIT",
  "AI_AUDITED",
  "READY_TO_SUBMIT",
  "USER_MARKED_SUBMITTED",
  "CANVAS_CONFIRMED",
  "GRADED",
] as const satisfies readonly TaskStatus[];

const statusProgress: Record<TaskStatus, number> = {
  DISCOVERED: 0,
  ACKNOWLEDGED: 10,
  STARTED: 35,
  READY_FOR_AUDIT: 80,
  AI_AUDITED: 85,
  READY_TO_SUBMIT: 95,
  USER_MARKED_SUBMITTED: 100,
  CANVAS_CONFIRMED: 100,
  GRADED: 100,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && taskStatuses.includes(value as TaskStatus);
}

export async function POST(request: Request) {
  const body: unknown = await request.json();

  if (!isRecord(body) || typeof body.assignmentId !== "string" || !isTaskStatus(body.status)) {
    return NextResponse.json({ error: "Invalid assignment status payload." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const status = body.status;
  const canvasSubmissionConfirmed = status === "CANVAS_CONFIRMED" || status === "GRADED";

  const { error } = await supabase
    .from("assignments")
    .update({
      canvas_submission_confirmed: canvasSubmissionConfirmed,
      progress_percent: statusProgress[status],
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.assignmentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status });
}
