import { afterEach, describe, expect, it, vi } from "vitest";
import {
  appSessionCookieName,
  authConfigReady,
  createSessionCookieValue,
  requireAppSession,
  verifyCronSecret,
  verifySessionCookieValue,
} from "./auth";
import { checkRateLimit, resetRateLimitForTests } from "./rate-limit";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  resetRateLimitForTests();
  vi.useRealTimers();
});

describe("auth guards", () => {
  it("fails closed when CRON_SECRET is missing", () => {
    delete process.env.CRON_SECRET;
    const response = verifyCronSecret(new Request("https://student-star.test/api/cron/canvas-sync"));

    expect(response?.status).toBe(503);
  });

  it("rejects missing or wrong cron authorization", () => {
    process.env.CRON_SECRET = "expected-secret";

    expect(verifyCronSecret(new Request("https://student-star.test/api/sync/canvas"))?.status).toBe(401);
    expect(
      verifyCronSecret(
        new Request("https://student-star.test/api/sync/canvas", {
          headers: { authorization: "Bearer wrong-secret" },
        }),
      )?.status,
    ).toBe(401);
  });

  it("accepts the configured cron authorization", () => {
    process.env.CRON_SECRET = "expected-secret";
    const response = verifyCronSecret(
      new Request("https://student-star.test/api/sync/canvas", {
        headers: { authorization: "Bearer expected-secret" },
      }),
    );

    expect(response).toBeNull();
  });

  it("verifies signed app session cookies", async () => {
    process.env.APP_ACCESS_PASSWORD = "local-password";
    process.env.SESSION_SECRET = "session-secret-with-enough-entropy";

    const cookie = await createSessionCookieValue();
    const request = new Request("https://student-star.test/api/lab-notes", {
      headers: { cookie: `${appSessionCookieName}=${encodeURIComponent(cookie)}` },
    });

    expect(authConfigReady()).toBe(true);
    expect(await verifySessionCookieValue(cookie)).toBe(true);
    expect(await requireAppSession(request)).toEqual({ ok: true });
  });

  it("rejects write API requests without a valid app session", async () => {
    process.env.APP_ACCESS_PASSWORD = "local-password";
    process.env.SESSION_SECRET = "session-secret-with-enough-entropy";

    expect(await requireAppSession(new Request("https://student-star.test/api/assignments/status"))).toEqual({
      error: "Unauthorized",
      ok: false,
      status: 401,
    });
  });
});

describe("rate limiting", () => {
  it("blocks requests after the configured limit until the window resets", async () => {
    expect((await checkRateLimit("login:test", 2, 60_000, 1_000)).allowed).toBe(true);
    expect((await checkRateLimit("login:test", 2, 60_000, 2_000)).allowed).toBe(true);
    expect((await checkRateLimit("login:test", 2, 60_000, 3_000)).allowed).toBe(false);
    expect((await checkRateLimit("login:test", 2, 60_000, 62_000)).allowed).toBe(true);
  });
});
