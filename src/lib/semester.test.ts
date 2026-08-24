import { describe, expect, it, vi } from "vitest";
import { daysUntil, formatShortDate } from "./semester";

describe("semester date helpers", () => {
  it("renders Canvas UTC due dates in Los Angeles time", () => {
    expect(formatShortDate("2026-09-10T06:59:00Z")).toBe("Sep 9, 11:59 PM");
  });

  it("calculates due dates by Los Angeles calendar day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T19:00:00Z"));

    expect(daysUntil("2026-09-10T06:59:00Z")).toBe(0);

    vi.useRealTimers();
  });
});
