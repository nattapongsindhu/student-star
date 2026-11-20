import { NextRequest, NextResponse } from "next/server";
import { requireAppSessionResponse } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
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
  "CANCELLED",
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
  CANCELLED: 0,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && taskStatuses.includes(value as TaskStatus);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAppSessionResponse(request);
  if (unauthorized) return unauthorized;

  const rateLimit = await checkRateLimit(`assignment-status:${clientKey(request)}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { headers: { "Retry-After": rateLimit.retryAfterSeconds.toString() }, status: 429 },
    );
  }

  const body: unknown = await request.json();

  if (
    !isRecord(body) ||
    typeof body.assignmentId !== "string" ||
    !isTaskStatus(body.status) ||
    (body.notes !== undefined && typeof body.notes !== "string")
  ) {
    return NextResponse.json({ error: "Invalid assignment status payload." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const status = body.status;
  const canvasSubmissionConfirmed = status === "CANVAS_CONFIRMED" || status === "GRADED";
  const { data: existingAssignment, error: lookupError } = await supabase
    .from("assignments")
    .select("course_id,title,status,notes")
    .eq("id", body.assignmentId)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }

  if (!existingAssignment) {
    return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
  }

  const submittedNotes = typeof body.notes === "string" && body.notes.trim() ? body.notes.trim() : null;
  const isUserMarkedSubmitted = status === "USER_MARKED_SUBMITTED";

  const { error } = await supabase
    .from("assignments")
    .update({
      canvas_submission_confirmed: canvasSubmissionConfirmed,
      progress_percent: statusProgress[status],
      ...(isUserMarkedSubmitted
        ? {
            notes: submittedNotes ?? existingAssignment.notes ?? "Marked submitted by user; awaiting Canvas confirmation.",
            priority_score: 0,
            risk_level: "LOW",
          }
        : {}),
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.assignmentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (isUserMarkedSubmitted && existingAssignment.status !== status) {
    const { error: eventError } = await supabase.from("change_events").insert({
      event_key: `${body.assignmentId}:user_marked_submitted:${new Date().toISOString()}`,
      course_id: existingAssignment.course_id,
      assignment_id: body.assignmentId,
      event_type: "user_marked_submitted",
      severity: "watch",
      title: `User marked submitted: ${existingAssignment.title}`,
      previous_value: existingAssignment.status,
      new_value: "USER_MARKED_SUBMITTED",
      source: "user",
    });

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, status });
}

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
