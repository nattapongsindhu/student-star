import { NextRequest, NextResponse } from "next/server";

export const appSessionCookieName = "student_star_session";
export const appSessionMaxAgeSeconds = 60 * 60 * 24 * 30;

const encoder = new TextEncoder();

export type AuthCheck =
  | { ok: true }
  | { ok: false; status: 401 | 503; error: string };

export function authConfigReady() {
  return Boolean(process.env.APP_ACCESS_PASSWORD && process.env.SESSION_SECRET);
}

export function verifyCronSecret(request: Request) {
  const expectedSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!expectedSecret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 503 });
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function createSessionCookieValue(now = Date.now()) {
  const timestamp = now.toString();
  const signature = await signValue(timestamp);
  return `${timestamp}.${signature}`;
}

export async function verifySessionCookieValue(value: string | undefined) {
  if (!authConfigReady() || !value) return false;

  const [timestamp, signature] = value.split(".");
  if (!timestamp || !signature) return false;

  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt)) return false;

  const expiresAt = issuedAt + appSessionMaxAgeSeconds * 1000;
  if (expiresAt < Date.now()) return false;

  const expectedSignature = await signValue(timestamp);
  return timingSafeEqual(signature, expectedSignature);
}

export async function verifyAppPassword(password: string) {
  const expectedPassword = process.env.APP_ACCESS_PASSWORD;
  if (!expectedPassword) return false;
  return timingSafeEqual(password, expectedPassword);
}

export async function requireAppSession(request: Request): Promise<AuthCheck> {
  if (!authConfigReady()) {
    return { ok: false, status: 503, error: "App authentication is not configured." };
  }

  const cookieValue = cookieFromRequest(request, appSessionCookieName);
  if (!(await verifySessionCookieValue(cookieValue))) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  return { ok: true };
}

export async function requireAppSessionResponse(request: Request) {
  const auth = await requireAppSession(request);
  if (auth.ok) return null;
  return NextResponse.json({ error: auth.error }, { status: auth.status });
}

export async function redirectIfUnauthenticated(request: NextRequest) {
  if (!authConfigReady()) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "config");
    return NextResponse.redirect(loginUrl);
  }

  const isAuthenticated = await verifySessionCookieValue(request.cookies.get(appSessionCookieName)?.value);
  if (isAuthenticated) return null;

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export function setSessionCookie(response: NextResponse, value: string) {
  response.cookies.set(appSessionCookieName, value, {
    httpOnly: true,
    maxAge: appSessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(appSessionCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

function cookieFromRequest(request: Request, name: string) {
  if (request instanceof NextRequest) {
    return request.cookies.get(name)?.value;
  }

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(";").map((item) => item.trim());
  const match = cookies.find((item) => item.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

async function signValue(value: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return "";

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return base64UrlEncode(signature);
}

function base64UrlEncode(value: ArrayBuffer) {
  const bytes = new Uint8Array(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function timingSafeEqual(left: string, right: string) {
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let diff = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    diff |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return diff === 0;
}
