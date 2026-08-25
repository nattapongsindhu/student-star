import { NextRequest, NextResponse } from "next/server";
import { redirectIfUnauthenticated } from "@/lib/auth";

const publicPrefixes = ["/_next", "/favicon.ico", "/login", "/api"];

export async function proxy(request: NextRequest) {
  if (publicPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const redirect = await redirectIfUnauthenticated(request);
  return redirect ?? NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
