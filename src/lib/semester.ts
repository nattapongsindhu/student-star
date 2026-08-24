import { AssignmentDifficulty, SourceKind, TaskStatus, TaskType } from "@/types/academic";

export type Course = {
  id: string;
  canvas_course_id: number | null;
  code: string;
  title: string;
  term_label: string;
  course_status: "upcoming" | "active" | "completed" | "case_study";
  campus: string;
  modality: string;
  units: number;
  final_grade: string | null;
  starts_on: string;
  ends_on: string;
  weekly_hours: number;
  color: string;
  source: SourceKind;
};

export type Assignment = {
  id: string;
  course_id: string;
  canvas_assignment_id: number | null;
  title: string;
  due_at: string | null;
  status: TaskStatus;
  points_possible: number | null;
  estimated_minutes: number;
  difficulty: AssignmentDifficulty;
  task_type: TaskType;
  priority_score: number;
  risk_level: "LOW" | "WATCH" | "HIGH" | "CRITICAL";
  progress_percent: number;
  canvas_submission_confirmed: boolean;
  notes: string | null;
  url: string | null;
  source: SourceKind;
};

export const semesterStart = "2026-08-31";
export const semesterEnd = "2026-12-20";
export const schoolTimeZone = "America/Los_Angeles";

export const seedCourses: Course[] = [
  {
    id: "asian-001",
    canvas_course_id: null,
    code: "ASIAN 001",
    title: "Asian American History",
    term_label: "Fall 2026",
    course_status: "upcoming",
    campus: "Harbor Online",
    modality: "Online",
    units: 3,
    final_grade: null,
    starts_on: "2026-10-05",
    ends_on: semesterEnd,
    weekly_hours: 4.58,
    color: "#0f766e",
    source: "mock",
  },
  {
    id: "cis-112",
    canvas_course_id: null,
    code: "CIS 112",
    title: "Operating Systems",
    term_label: "Fall 2026",
    course_status: "upcoming",
    campus: "City + LACC FH 201",
    modality: "Online lecture + Thu lab 2:30-5:40 PM",
    units: 3,
    final_grade: null,
    starts_on: semesterStart,
    ends_on: semesterEnd,
    weekly_hours: 5.25,
    color: "#2563eb",
    source: "mock",
  },
  {
    id: "cis-162",
    canvas_course_id: null,
    code: "CIS 162",
    title: "Cyber Security I",
    term_label: "Fall 2026",
    course_status: "upcoming",
    campus: "City Online",
    modality: "Online lecture + online lab",
    units: 3,
    final_grade: null,
    starts_on: semesterStart,
    ends_on: semesterEnd,
    weekly_hours: 4.17,
    color: "#7c3aed",
    source: "mock",
  },
  {
    id: "cis-166",
    canvas_course_id: null,
    code: "CIS 166",
    title: "Computer Forensics",
    term_label: "Fall 2026",
    course_status: "active",
    campus: "City Online",
    modality: "Online lecture + online lab",
    units: 3,
    final_grade: null,
    starts_on: semesterStart,
    ends_on: semesterEnd,
    weekly_hours: 5.25,
    color: "#be123c",
    source: "mock",
  },
  {
    id: "cis-214",
    canvas_course_id: null,
    code: "CIS 214",
    title: "Intro to Network Plus",
    term_label: "Fall 2026",
    course_status: "upcoming",
    campus: "City Online",
    modality: "Online lecture + online lab",
    units: 3,
    final_grade: null,
    starts_on: semesterStart,
    ends_on: semesterEnd,
    weekly_hours: 4.17,
    color: "#c2410c",
    source: "mock",
  },
  {
    id: "cs-119",
    canvas_course_id: null,
    code: "CS 119",
    title: "Python Programming",
    term_label: "Fall 2026",
    course_status: "upcoming",
    campus: "City Online",
    modality: "Late-start online lecture + lab",
    units: 3,
    final_grade: null,
    starts_on: "2026-10-26",
    ends_on: semesterEnd,
    weekly_hours: 8.5,
    color: "#15803d",
    source: "mock",
  },
  {
    id: "pols-c1000",
    canvas_course_id: 362736,
    code: "POLS C1000",
    title: "American Government & Politics",
    term_label: "Summer 2026",
    course_status: "case_study",
    campus: "City Online",
    modality: "Completed online course used as a Student Star case study",
    units: 3,
    final_grade: "Expected A",
    starts_on: "2026-07-20",
    ends_on: "2026-08-23",
    weekly_hours: 0,
    color: "#6d28d9",
    source: "canvas",
  },
  {
    id: "cis-210",
    canvas_course_id: 362781,
    code: "CIS 210",
    title: "Intro to Computer Networking",
    term_label: "Summer 2026",
    course_status: "case_study",
    campus: "City Online",
    modality: "Completed Canvas course used as a networking case study",
    units: 3,
    final_grade: "A",
    starts_on: "2026-05-17",
    ends_on: "2026-08-10",
    weekly_hours: 0,
    color: "#0e7490",
    source: "canvas",
  },
  {
    id: "anthro-102",
    canvas_course_id: 341065,
    code: "ANTHRO 102",
    title: "Human Ways Of Life",
    term_label: "Spring 2026",
    course_status: "case_study",
    campus: "City Online",
    modality: "Completed Canvas course used as a general education case study",
    units: 3,
    final_grade: "A",
    starts_on: "2026-01-26",
    ends_on: "2026-06-21",
    weekly_hours: 0,
    color: "#a16207",
    source: "canvas",
  },
  {
    id: "cs-101",
    canvas_course_id: 341019,
    code: "CS 101",
    title: "Intro to Comp Sci",
    term_label: "Spring 2026",
    course_status: "case_study",
    campus: "City Online",
    modality: "Completed Canvas course used as a computer science case study",
    units: 3,
    final_grade: "A",
    starts_on: "2026-02-09",
    ends_on: "2026-06-08",
    weekly_hours: 0,
    color: "#4338ca",
    source: "canvas",
  },
  {
    id: "engl-c1000",
    canvas_course_id: null,
    code: "ENGL C1000",
    title: "Academic Reading & Writing",
    term_label: "Spring 2026",
    course_status: "case_study",
    campus: "SIS history",
    modality: "Completed course from SIS history; Canvas access not visible to current token",
    units: 3,
    final_grade: "A",
    starts_on: "2026-01-26",
    ends_on: "2026-06-21",
    weekly_hours: 0,
    color: "#047857",
    source: "user",
  },
  {
    id: "health-101",
    canvas_course_id: null,
    code: "HEALTH 101",
    title: "Intro Public Health",
    term_label: "Spring 2026",
    course_status: "case_study",
    campus: "SIS history",
    modality: "Completed course from SIS history; Canvas access not visible to current token",
    units: 3,
    final_grade: "A",
    starts_on: "2026-01-26",
    ends_on: "2026-06-21",
    weekly_hours: 0,
    color: "#0891b2",
    source: "user",
  },
];

export const seedAssignments: Assignment[] = [
  {
    id: "cis112-week1-shell",
    course_id: "cis-112",
    canvas_assignment_id: null,
    title: "Week 1 OS setup and shell commands lab",
    due_at: "2026-09-06T23:59:00-07:00",
    status: "DISCOVERED",
    points_possible: 25,
    estimated_minutes: 150,
    difficulty: "medium",
    task_type: "lab",
    priority_score: 82,
    risk_level: "CRITICAL",
    progress_percent: 0,
    canvas_submission_confirmed: false,
    notes: "Capture terminal output and VM settings before submission.",
    url: null,
    source: "mock",
  },
  {
    id: "cis162-security-baseline",
    course_id: "cis-162",
    canvas_assignment_id: null,
    title: "Security baseline reading quiz",
    due_at: "2026-09-07T23:59:00-07:00",
    status: "ACKNOWLEDGED",
    points_possible: 20,
    estimated_minutes: 75,
    difficulty: "light",
    task_type: "quiz",
    priority_score: 70,
    risk_level: "HIGH",
    progress_percent: 0,
    canvas_submission_confirmed: false,
    notes: "Review CIA triad, threat categories, and password policy basics.",
    url: null,
    source: "mock",
  },
  {
    id: "cis166-evidence-log",
    course_id: "cis-166",
    canvas_assignment_id: null,
    title: "Evidence handling lab log",
    due_at: "2026-09-08T23:59:00-07:00",
    status: "STARTED",
    points_possible: 30,
    estimated_minutes: 180,
    difficulty: "heavy",
    task_type: "lab",
    priority_score: 88,
    risk_level: "CRITICAL",
    progress_percent: 60,
    canvas_submission_confirmed: false,
    notes: "Keep commands, hashes, screenshots, and chain-of-custody notes together.",
    url: null,
    source: "mock",
  },
  {
    id: "cis214-network-map",
    course_id: "cis-214",
    canvas_assignment_id: null,
    title: "Network devices map and vocabulary",
    due_at: "2026-09-09T23:59:00-07:00",
    status: "READY_FOR_AUDIT",
    points_possible: 25,
    estimated_minutes: 120,
    difficulty: "medium",
    task_type: "project",
    priority_score: 76,
    risk_level: "HIGH",
    progress_percent: 90,
    canvas_submission_confirmed: false,
    notes: "Check router/switch/AP terms before submitting.",
    url: null,
    source: "mock",
  },
];

export function getPhase(date = new Date()) {
  const time = date.getTime();
  const phase2 = new Date("2026-10-05T00:00:00-07:00").getTime();
  const phase3 = new Date("2026-10-26T00:00:00-07:00").getTime();

  if (time < phase2) {
    return {
      name: "Phase 1",
      label: "4 core IT classes",
      risk: "Build lab routines before late-start courses arrive.",
    };
  }

  if (time < phase3) {
    return {
      name: "Phase 2",
      label: "ASIAN 001 joins",
      risk: "Add writing/discussion work without letting labs pile up.",
    };
  }

  return {
    name: "Phase 3",
    label: "Peak 18-unit load",
    risk: "Python starts. Protect fixed weekly study blocks and submit early.",
  };
}

export function daysUntil(value: string | null) {
  if (!value) return null;
  const today = zonedCalendarDate(new Date());
  const due = zonedCalendarDate(new Date(value));
  const ms = due.getTime() - today.getTime();
  return Math.ceil(ms / 86_400_000);
}

export function formatShortDate(value: string | null) {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: schoolTimeZone,
  }).format(new Date(value));
}

function zonedCalendarDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: schoolTimeZone,
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)));
}
