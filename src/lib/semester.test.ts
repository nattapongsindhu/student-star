import { describe, expect, it, vi } from "vitest";
import { daysUntil, formatShortDate } from "./semester";

describe("semester date helpers", () => {
  it("renders Canvas UTC due dates in Los Angeles time", () => {
    expect(formatShortDate("2026-09-10T06:59:00Z")).toBe("Sep 9, 23:59");
  });

  it("calculates due dates by Los Angeles calendar day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T19:00:00Z"));

    expect(daysUntil("2026-09-10T06:59:00Z")).toBe(0);

    vi.useRealTimers();
  });

  it("keeps calendar-day math stable across the fall DST transition", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-01T18:00:00Z"));

    expect(formatShortDate("2026-11-02T07:59:00Z")).toBe("Nov 1, 23:59");
    expect(daysUntil("2026-11-02T07:59:00Z")).toBe(0);

    vi.useRealTimers();
  });

  it("uses PST correctly after daylight saving time ends", () => {
    expect(formatShortDate("2026-11-03T07:59:00Z")).toBe("Nov 2, 23:59");
  });
});
