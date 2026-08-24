export type SourceKind = "canvas" | "syllabus" | "user" | "ai_inference" | "mock";

export type TaskStatus =
  | "DISCOVERED"
  | "ACKNOWLEDGED"
  | "STARTED"
  | "READY_FOR_AUDIT"
  | "AI_AUDITED"
  | "READY_TO_SUBMIT"
  | "USER_MARKED_SUBMITTED"
  | "CANVAS_CONFIRMED"
  | "GRADED";

export type RiskLevel = "LOW" | "WATCH" | "HIGH" | "CRITICAL";

export type TaskType =
  | "assignment"
  | "essay"
  | "discussion"
  | "reply"
  | "quiz"
  | "lab"
  | "simulation"
  | "project"
  | "presentation"
  | "midterm"
  | "final"
  | "exam"
  | "reading"
  | "homework"
  | "coding_assignment"
  | "paper"
  | "research_assignment"
  | "extra_credit"
  | "module_requirement"
  | "other";

export type AssignmentDifficulty = "light" | "medium" | "heavy";

export type RiskInput = {
  dueAt: string | null;
  pointsPossible: number | null;
  estimatedMinutes: number;
  progressPercent: number;
  status: TaskStatus;
  difficulty: AssignmentDifficulty;
  courseGradePercent: number | null;
  aSafetyMargin: number | null;
  isAcceleratedCourse: boolean;
  canvasSubmissionConfirmed: boolean;
};

export type RiskBreakdown = {
  deadline: number;
  points: number;
  effort: number;
  progress: number;
  status: number;
  grade: number;
  accelerated: number;
  submission: number;
};

export type RiskResult = {
  score: number;
  level: RiskLevel;
  breakdown: RiskBreakdown;
  explanation: string;
};
