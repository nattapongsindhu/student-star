import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const body = await request.json();
  const assignmentId = String(body.assignment_id ?? "");
  const note = String(body.note ?? "").trim();

  if (!assignmentId || !note) {
    return NextResponse.json({ error: "assignment_id and note are required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("lab_notes")
    .insert({
      assignment_id: assignmentId,
      note,
      command_snippet: body.command_snippet ? String(body.command_snippet) : null,
      result_summary: body.result_summary ? String(body.result_summary) : null,
      next_step: body.next_step ? String(body.next_step) : null,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, note: data });
}
