import type { Assignment, Course } from "@/lib/semester";
import type { SourceKind, TaskStatus, TaskType } from "@/types/academic";

export const sourceLabels: Record<SourceKind, string> = {
  ai_inference: "AI",
  canvas: "Live Canvas",
  mock: "Local Seed",
  syllabus: "Syllabus",
  user: "Manual",
};

export const taskTypeLabels: Record<TaskType, string> = {
  assignment: "Assignment",
  coding_assignment: "Code",
  discussion: "Discussion",
  essay: "Essay",
  exam: "Exam",
  extra_credit: "Extra Credit",
  final: "Final",
  homework: "Homework",
  lab: "Lab",
  midterm: "Midterm",
  module_requirement: "Module",
  other: "Other",
  paper: "Paper",
  presentation: "Presentation",
  project: "Project",
  quiz: "Quiz",
  reading: "Reading",
  reply: "Reply",
  research_assignment: "Research",
  simulation: "Simulation",
};

export function sourceBadgeClass(source: SourceKind) {
  if (source === "canvas") return "bg-emerald-50 text-emerald-800";
  if (source === "mock") return "bg-slate-100 text-slate-700";
  if (source === "user") return "bg-sky-50 text-sky-800";
  if (source === "syllabus") return "bg-amber-50 text-amber-800";
  return "bg-violet-50 text-violet-800";
}

export function sanitizeSnippet(value: string | null) {
  if (!value) return "No assignment guide is available yet.";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 420);
}

export function submissionLabel(status: TaskStatus, confirmed: boolean) {
  if (status === "GRADED") return "Graded";
  if (status === "CANVAS_CONFIRMED" || confirmed) return "Submitted";
  if (status === "USER_MARKED_SUBMITTED") return "Marked Submitted";
  return "Unsubmitted / Missing";
}

export function submissionClass(status: TaskStatus, confirmed: boolean) {
  if (status === "GRADED") return "bg-emerald-50 text-emerald-800";
  if (status === "CANVAS_CONFIRMED" || confirmed || status === "USER_MARKED_SUBMITTED") {
    return "bg-sky-50 text-sky-800";
  }
  return "bg-amber-50 text-amber-800";
}

export function pointsLabel(assignment: Assignment) {
  if (assignment.status === "GRADED" && assignment.points_possible !== null) {
    return `${assignment.points_possible} pts · Graded`;
  }
  return assignment.points_possible !== null ? `${assignment.points_possible} pts` : "No points listed";
}

export function totalPoints(assignments: Assignment[]) {
  return assignments.reduce((sum, assignment) => sum + (assignment.points_possible ?? 0), 0);
}

export function courseOutcome(course: Course) {
  if (course.final_grade) return course.final_grade;
  if (course.course_status === "case_study") return "Verified outcome";
  return "In progress";
}

export function instructorFor(course: Course) {
  if (course.code === "POLS C1000") return "Anika Toussant";
  if (course.code === "CIS 210") return "Mike Yazdanian";
  if (course.code === "ANTHRO 102") return "Brian Bartelt";
  if (course.code === "CS 101") return "Pamela Atkinson";
  if (course.code === "CIS 166") return "Allan Pratt";
  if (course.code === "CIS 162") return "Ray Lampano, Jr.";
  return "Instructor not synced yet";
}

export function topicsFor(course: Course) {
  const title = course.title.toLowerCase();
  if (title.includes("forensic")) return ["Evidence handling", "Forensic tools", "Reporting", "Lab documentation"];
  if (title.includes("network")) return ["Network devices", "IP addressing", "Subnetting", "Troubleshooting"];
  if (title.includes("government")) return ["Institutions", "Civic participation", "Policy analysis", "Discussion writing"];
  if (title.includes("comp sci") || title.includes("python")) return ["Programming practice", "Problem solving", "Code tracing", "Projects"];
  if (title.includes("writing")) return ["Reading response", "Essay planning", "Revision", "Source use"];
  if (title.includes("health")) return ["Public health systems", "Prevention", "Community health", "Policy"];
  if (title.includes("anthro")) return ["Culture", "Human behavior", "Ethnography", "Comparative analysis"];
  return ["Course routine", "Assignments", "Review cycles", "Submission proof"];
}
