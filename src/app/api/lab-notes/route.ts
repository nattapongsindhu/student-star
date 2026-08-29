import { NextRequest, NextResponse } from "next/server";
import { requireAppSessionResponse } from "@/lib/auth";
import { firstOversizedLabNoteField, normalizeLabNotePayload } from "@/lib/lab-note-validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAppSessionResponse(request);
  if (unauthorized) return unauthorized;

  const rateLimit = await checkRateLimit(`lab-notes:${clientKey(request)}`, 30, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { headers: { "Retry-After": rateLimit.retryAfterSeconds.toString() }, status: 429 },
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const body = await request.json();
  const assignmentId = String(body.assignment_id ?? "");
  const payload = normalizeLabNotePayload(body);

  if (!assignmentId || !payload.note) {
    return NextResponse.json({ error: "assignment_id and note are required." }, { status: 400 });
  }

  const oversizedField = firstOversizedLabNoteField(payload);

  if (oversizedField) {
    return NextResponse.json(
      { error: `${oversizedField} is too long.` },
      { status: 413 },
    );
  }

  const { data, error } = await supabase
    .from("lab_notes")
    .insert({
      assignment_id: assignmentId,
      note: payload.note,
      command_snippet: payload.commandSnippet,
      result_summary: payload.resultSummary,
      next_step: payload.nextStep,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, note: data });
}

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
