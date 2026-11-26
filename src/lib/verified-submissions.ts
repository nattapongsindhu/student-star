import type { Assignment } from "./semester";

export type VerifiedSubmissionOverride = {
  courseCodeMatch: (courseCodeOrId: string) => boolean;
  titleMatch: (title: string) => boolean;
  notes: string;
};

export const verifiedSubmissionOverrides: VerifiedSubmissionOverride[] = [
  {
    courseCodeMatch: (code) => code.toLowerCase().includes("214"),
    titleMatch: (title) => {
      const t = title.toLowerCase();
      return (
        t.includes("working with ip addresses") ||
        t.includes("network simulation 11-1") ||
        t.includes("lab 6-1") ||
        t.includes("lab: 6-1")
      );
    },
    notes:
      "LabConnection (Guide to Networking Essentials 9th Ed, Lab 6-1): 100% completed on Nov 10, 2026. Snapshot proof verified. Notified professor re: Canvas LTI sync delay.",
  },
  {
    courseCodeMatch: (code) => code.toLowerCase().includes("214"),
    titleMatch: (title) => {
      const t = title.toLowerCase();
      return (
        t.includes("chapter 11 network operating system fundamentals") ||
        t.includes("quiz: chapter 11") ||
        t.includes("quiz chapter 11")
      );
    },
    notes:
      "Cengage MindTap: Score 25/25 (100%) submitted on Nov 10, 2026 @ 11:33 PM PST. Snapshot proof verified. Notified professor re: Canvas LTI sync delay.",
  },
];

export function findVerifiedSubmissionOverride(
  courseCodeOrId: string,
  title: string,
): VerifiedSubmissionOverride | undefined {
  return verifiedSubmissionOverrides.find(
    (override) => override.courseCodeMatch(courseCodeOrId) && override.titleMatch(title),
  );
}

export function reconcileAssignmentWithVerifiedProof(
  courseCodeOrId: string,
  assignment: Assignment,
): Assignment {
  // If already confirmed by Canvas gradebook, leave as confirmed/graded
  if (assignment.status === "CANVAS_CONFIRMED" || assignment.status === "GRADED") {
    return assignment;
  }

  const match = findVerifiedSubmissionOverride(courseCodeOrId, assignment.title);
  if (!match) return assignment;

  return {
    ...assignment,
    status: "USER_MARKED_SUBMITTED",
    progress_percent: 100,
    priority_score: 0,
    risk_level: "LOW",
    canvas_submission_confirmed: false,
    notes: assignment.notes || match.notes,
  };
}
