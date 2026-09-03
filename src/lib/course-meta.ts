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
  if (course.official_grade) return course.official_grade;
  if (course.final_grade && !course.final_grade.startsWith("Expected ")) return course.final_grade;
  if (course.course_status === "case_study") return "Verified outcome";
  return "In progress";
}

export function courseGradeSummaryFor(course: Course) {
  const expected = course.expected_grade ?? (course.final_grade?.startsWith("Expected ") ? course.final_grade.slice(9) : null);
  const official = course.official_grade ?? (course.final_grade && !course.final_grade.startsWith("Expected ") ? course.final_grade : null);
  return {
    currentCanvas: course.current_canvas_grade ?? "Not synced",
    expected: expected ?? "Not set",
    official: official ?? "Not posted",
  };
}

export function compactCourseTitleFor(course: Course) {
  if (course.code === "ENGL C1000") return "Academic Rd&Wr";
  if (course.code === "CIS 210") return "Intro to Comp Network";
  if (course.code === "CIS 112") return "OS: Beginning Linux";
  if (course.code === "CIS 166") return "Comp Forens";
  if (course.code === "CIS 214") return "Network+";
  if (course.code === "CIS 162") return "Cyber Security I";
  return course.title;
}

export function displayCourseTitleFor(course: Course) {
  if (course.code === "CIS 112") return "Operating Systems: Beginning Linux";
  if (course.code === "CIS 162") return "Introduction to Cyber Security I";
  if (course.code === "CIS 214") return "Introduction to Network Plus";
  return course.title;
}

export function classTypeLinesFor(course: Course) {
  if (course.code === "CIS 112") return ["Online (Lecture)", "Mon 16:00-18:00", "Campus (Labs)", "Thu 14:30-17:40"];
  if (course.code === "CIS 214") return ["Online", "Tue 15:00-17:00"];
  if (course.code === "ENGL C1000") return ["Online", "Wed 18:50-22:00"];

  const modality = course.modality.toLowerCase();
  const isAsyncOnline =
    course.modality === "Online" ||
    modality.includes("completed online course") ||
    modality.includes("self-paced online") ||
    modality === "online lecture + online lab" ||
    modality === "late-start online lecture + lab";

    if (isAsyncOnline) return ["Online", "(Asynchronous)"];

  return course.modality
    .split(/\s*(?:\+|;)\s+/)
    .flatMap((line) => line.replace(/^Online(?: live Zoom| Lecture| lecture)(?:\s+(.+))?$/, (_, schedule) => schedule ? `Online|${schedule}` : "Online").split("|"))
    .flatMap((line) => line.replace(/^Lecture\s+(.+)$/, "Campus|$1").split("|"))
    .map((line) => line.trim())
    .map((line) => line.replace(/\b(?:live\s+Zoom|lab)\b/gi, "").replace(/\s{2,}/g, " ").trim())
    .filter((line) => line.toLowerCase() !== "recordings posted")
    .filter(Boolean);
}

export function classTypeSummaryFor(course: Course) {
  const [type, schedule] = classTypeLinesFor(course);
  if (!schedule) return type;
  return `${type} ${schedule}`;
}

export function campusDisplayFor(course: Course) {
  if (course.code === "CIS 112") return "LACC FH-201";
  return course.campus;
}

export function instructorFor(course: Course) {
  if (course.code === "ASIAN 001") return "Katie Bui";
  if (course.code === "POLS C1000") return "Anika Toussant";
  if (course.code === "CIS 112") return "Mike Yazdanian";
  if (course.code === "CIS 210") return "Mike Yazdanian";
  if (course.code === "ANTHRO 102") return "Brian Bartelt";
  if (course.code === "CS 101") return "Pamela Atkinson";
  if (course.code === "ENGL C1000") return "Kylowna Moton";
  if (course.code === "HEALTH 101") return "Tracy Harkins";
  if (course.code === "CIS 166") return "Allan Pratt";
  if (course.code === "CO TECH 002") return "Mike Yazdanian";
  if (course.code === "CIS 212") return "Mike Yazdanian";
  if (course.code === "CIS 213") return "Mike Yazdanian";
  if (course.code === "CIS 211") return "Allan Pratt";
  if (course.code === "CIS 170") return "Raynaldo Lampano";
  if (course.code === "CIS 191") return "Andrea Loney";
  if (course.code === "CIS 162") return "Raynaldo Lampano";
  if (course.code === "CIS 214") return "Farahnaz Nezhad";
  if (course.code === "CS 119") return "Mohammed Abdelrahim";
  return "Pending";
}

export type ProfessorRating = {
  checkedOn: string;
  difficulty: string | null;
  quality: string | null;
  reviewCount: number | null;
  sourceUrl: string | null;
};

const rateMyProfessorRatings: Record<string, ProfessorRating> = {
  "Allan Pratt": {
    checkedOn: "2026-08-29",
    difficulty: null,
    quality: null,
    reviewCount: 0,
    sourceUrl: "https://www.ratemyprofessors.com/professor/2277411",
  },
  "Andrea Loney": {
    checkedOn: "2026-08-29",
    difficulty: "2.0",
    quality: "5.0",
    reviewCount: 3,
    sourceUrl: "https://www.ratemyprofessors.com/professor/2166640",
  },
  "Brian Bartelt": {
    checkedOn: "2026-08-29",
    difficulty: "3.8",
    quality: "3.2",
    reviewCount: 183,
    sourceUrl: "https://www.ratemyprofessors.com/professor/1241673",
  },
  "Kylowna Moton": {
    checkedOn: "2026-08-29",
    difficulty: "3.9",
    quality: "3.2",
    reviewCount: 56,
    sourceUrl: "https://www.ratemyprofessors.com/professor/2324956",
  },
  "Mike Yazdanian": {
    checkedOn: "2026-08-29",
    difficulty: "2.4",
    quality: "4.2",
    reviewCount: 5,
    sourceUrl: "https://www.ratemyprofessors.com/professor/2840472",
  },
  "Pamela Atkinson": {
    checkedOn: "2026-08-29",
    difficulty: "1.0",
    quality: "1.8",
    reviewCount: 4,
    sourceUrl: "https://www.ratemyprofessors.com/professor/435847",
  },
  "Raynaldo Lampano": {
    checkedOn: "2026-08-29",
    difficulty: "2.6",
    quality: "4.0",
    reviewCount: 5,
    sourceUrl: "https://www.ratemyprofessors.com/professor/1625718",
  },
  "Tracy Harkins": {
    checkedOn: "2026-08-29",
    difficulty: "1.8",
    quality: "4.8",
    reviewCount: 6,
    sourceUrl: "https://www.ratemyprofessors.com/professor/1905542",
  },
};

export function professorRatingFor(course: Course) {
  return rateMyProfessorRatings[instructorFor(course)] ?? null;
}

export function professorRatingLineFor(course: Course) {
  const rating = professorRatingFor(course);
  if (!rating) return "RMP pending";
  if (!rating.quality || rating.reviewCount === null) return "RMP pending";

  const reviewWord = rating.reviewCount === 1 ? "review" : "reviews";
  return `RMP ${rating.quality}/5 · ${rating.reviewCount} ${reviewWord}`;
}

export function sourceProofFor(course: Course) {
  const sourceProofs: Record<string, string[]> = {
    "ANTHRO 102": ["Canvas course data", "SIS weekly schedule screenshot", "SIS course history screenshot"],
    "CIS 112": ["SIS weekly schedule screenshot", "Local seed"],
    "CIS 162": ["Canvas welcome page", "Section LEC 17890 / LAB 17891", "Saturday Zoom schedule"],
    "CIS 166": ["Canvas syllabus", "Instructor information", "Mon/Wed Zoom schedule"],
    "CIS 210": ["Syllabus PDF", "Canvas grade PDF", "SIS course history screenshot"],
    "CIS 214": ["Syllabus image", "Tuesday Zoom schedule"],
    "CS 101": ["Canvas course data", "SIS weekly schedule screenshot", "SIS course history screenshot"],
    "CS 119": ["Local seed", "SIS enrollment source pending"],
    "ENGL C1000": ["Course roster PDF", "Syllabus PDF", "SIS weekly schedule screenshot"],
    "HEALTH 101": ["Syllabus PDF", "Canvas modules/grades PDFs", "SIS course history screenshot"],
    "POLS C1000": ["Canvas assignment sync", "SIS course history screenshot"],
  };

  if (sourceProofs[course.code]) return sourceProofs[course.code];
  if (course.term_label.includes("2027")) return ["Student Educational Plan", "Schedule TBA"];
  return [sourceLabels[course.source]];
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
