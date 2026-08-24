import { describe, expect, it } from "vitest";
import { CanvasApiError, getCanvasSyncFailure, isCanvasTokenExpiredError } from "./canvas-sync";

describe("Canvas sync error handling", () => {
  it("marks 401 Canvas responses as token_expired", () => {
    const failure = getCanvasSyncFailure(new CanvasApiError(401, "Unauthorized"), "2026-08-24T20:00:00.000Z");

    expect(failure).toEqual({
      syncStatus: "token_expired",
      lastAttempt: "2026-08-24T20:00:00.000Z",
      message: "Canvas API failed: 401 Unauthorized",
      runStatus: "token_expired",
    });
  });

  it("detects invalid or expired token messages", () => {
    expect(isCanvasTokenExpiredError(new Error("Canvas token expired"))).toBe(true);
    expect(isCanvasTokenExpiredError(new Error("Canvas API failed: 503 Service Unavailable"))).toBe(false);
  });
});
