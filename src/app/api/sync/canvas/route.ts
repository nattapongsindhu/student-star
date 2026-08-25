import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/auth";
import { recordCanvasSyncFailure, syncCanvasToSupabase } from "@/lib/canvas-sync";

export async function POST(request: NextRequest) {
  const unauthorized = verifyCronSecret(request);
  if (unauthorized) return unauthorized;

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
