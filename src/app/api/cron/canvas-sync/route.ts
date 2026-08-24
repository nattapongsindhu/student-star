import { NextRequest, NextResponse } from "next/server";
import { recordCanvasSyncFailure, syncCanvasToSupabase } from "@/lib/canvas-sync";

export async function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncCanvasToSupabase();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const failure = await recordCanvasSyncFailure(error);

    return NextResponse.json(
      { ok: false, error: failure.message, syncStatus: failure.syncStatus, lastAttempt: failure.lastAttempt },
      { status: failure.syncStatus === "token_expired" ? 401 : 500 },
    );
  }
}
