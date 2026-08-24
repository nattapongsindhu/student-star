import { RiskInput, RiskLevel, RiskResult } from "@/types/academic";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function riskLevel(score: number): RiskLevel {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 30) return "WATCH";
  return "LOW";
}

export function daysUntilDue(dueAt: string | null, now = new Date()) {
  if (!dueAt) return null;
  return Math.ceil((new Date(dueAt).getTime() - now.getTime()) / 86_400_000);
}

export function calculateAssignmentRisk(input: RiskInput, now = new Date()): RiskResult {
  const days = daysUntilDue(input.dueAt, now);
  const dueMs = input.dueAt ? new Date(input.dueAt).getTime() - now.getTime() : null;
  const deadline =
    dueMs === null || days === null
      ? 8
      : dueMs < 0
        ? 35
        : dueMs <= 86_400_000
          ? 32
          : days <= 2
            ? 26
            : days <= 3
              ? 19
              : days <= 7
                ? 11
                : 4;

  const points = clamp(Math.round((input.pointsPossible ?? 10) / 3), 3, 18);
  const effort = input.estimatedMinutes >= 180 ? 16 : input.estimatedMinutes >= 90 ? 10 : 5;
  const progress = input.progressPercent < 10 ? 14 : input.progressPercent < 50 ? 9 : input.progressPercent < 90 ? 5 : 0;
  const status = ["USER_MARKED_SUBMITTED", "READY_TO_SUBMIT"].includes(input.status) && !input.canvasSubmissionConfirmed ? 25 : 0;
  const grade = input.aSafetyMargin !== null && input.aSafetyMargin < 3 ? 9 : input.courseGradePercent !== null && input.courseGradePercent < 90 ? 14 : 0;
  const accelerated = input.isAcceleratedCourse ? 7 : 0;
  const submission = input.status === "CANVAS_CONFIRMED" || input.status === "GRADED" ? -35 : 0;

  const breakdown = {
    deadline,
    points,
    effort,
    progress,
    status,
    grade,
    accelerated,
    submission,
  };

  const rawScore = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const score = clamp(rawScore, 0, 100);
  const level = riskLevel(score);
  const explanation =
    level === "CRITICAL"
      ? "Handle this first: the deadline, progress, or submission verification creates critical risk."
      : level === "HIGH"
        ? "Prioritize soon: this task has enough deadline or workload pressure to threaten the week."
        : level === "WATCH"
          ? "Keep visible: this is not urgent yet, but it should stay on the plan."
          : "Low immediate risk based on current due date, progress, and submission state.";

  return {
    score,
    level,
    breakdown,
    explanation,
  };
}
