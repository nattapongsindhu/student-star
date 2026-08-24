import { NextRequest, NextResponse } from "next/server";
import { recordCanvasSyncFailure, syncCanvasToSupabase } from "@/lib/canvas-sync";

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
    const failure = await recordCanvasSyncFailure(error);

    return NextResponse.json(
      { ok: false, error: failure.message, syncStatus: failure.syncStatus, lastAttempt: failure.lastAttempt },
      { status: failure.syncStatus === "token_expired" ? 401 : 500 },
    );
  }
}
