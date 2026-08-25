import { NextRequest, NextResponse } from "next/server";
import { authConfigReady, createSessionCookieValue, setSessionCookie, verifyAppPassword } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(String(formData.get("next") ?? "/"));
  const rateLimit = checkRateLimit(`login:${clientKey(request)}`, 8, 60_000);

  if (!rateLimit.allowed) {
    return NextResponse.redirect(new URL(`/login?error=rate&next=${encodeURIComponent(nextPath)}`, request.url));
  }

  if (!authConfigReady()) {
    return NextResponse.redirect(new URL("/login?error=config", request.url));
  }

  if (!(await verifyAppPassword(password))) {
    return NextResponse.redirect(new URL(`/login?error=invalid&next=${encodeURIComponent(nextPath)}`, request.url));
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url));
  setSessionCookie(response, await createSessionCookieValue());
  return response;
}

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function safeNextPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}
