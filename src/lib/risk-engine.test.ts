import { describe, expect, it } from "vitest";
import { calculateAssignmentRisk, riskLevel } from "./risk-engine";

const now = new Date("2026-09-14T08:00:00-07:00");

describe("risk engine", () => {
  it("flags an unconfirmed local submission as critical risk", () => {
    const result = calculateAssignmentRisk(
      {
        dueAt: "2026-09-14T23:59:00-07:00",
        pointsPossible: 50,
        estimatedMinutes: 120,
        progressPercent: 100,
        status: "USER_MARKED_SUBMITTED",
        difficulty: "heavy",
        courseGradePercent: 94,
        aSafetyMargin: 4,
        isAcceleratedCourse: false,
        canvasSubmissionConfirmed: false,
      },
      now,
    );

    expect(result.level).toBe("CRITICAL");
    expect(result.breakdown.status).toBe(25);
  });

  it("reduces risk when Canvas confirms the submission", () => {
    const result = calculateAssignmentRisk(
      {
        dueAt: "2026-09-14T23:59:00-07:00",
        pointsPossible: 50,
        estimatedMinutes: 120,
        progressPercent: 100,
        status: "CANVAS_CONFIRMED",
        difficulty: "heavy",
        courseGradePercent: 94,
        aSafetyMargin: 4,
        isAcceleratedCourse: false,
        canvasSubmissionConfirmed: true,
      },
      now,
    );

    expect(result.score).toBeLessThan(40);
  });

  it("uses the configured risk bands", () => {
    expect(riskLevel(10)).toBe("LOW");
    expect(riskLevel(40)).toBe("WATCH");
    expect(riskLevel(65)).toBe("HIGH");
    expect(riskLevel(90)).toBe("CRITICAL");
  });
});
