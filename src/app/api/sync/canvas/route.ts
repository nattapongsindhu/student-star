import { NextRequest, NextResponse } from "next/server";
import { syncCanvasToSupabase } from "@/lib/canvas-sync";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET;
  const providedSecret = request.headers.get("authorization")?.replace("Bearer ", "");

  if (expectedSecret && providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncCanvasToSupabase();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync error";
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("sync_runs").insert({
        source: "canvas",
        status: "failed",
        error_message: message,
        started_at: new Date().toISOString(),
        finished_at: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
