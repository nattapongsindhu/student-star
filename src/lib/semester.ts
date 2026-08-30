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
  current_canvas_grade?: string | null;
  expected_grade?: string | null;
  official_grade?: string | null;
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

type CompletedAssignmentSeed = {
  courseId: string;
  dueDate: string;
  id: string;
  points: number | null;
  title: string;
  type: TaskType;
};

function completedAssignmentSeed(input: CompletedAssignmentSeed): Assignment {
  return {
    id: `${input.courseId}-${input.id}`,
    course_id: input.courseId,
    canvas_assignment_id: null,
    title: input.title,
    due_at: `${input.dueDate}T23:59:00-07:00`,
    status: "GRADED",
    points_possible: input.points,
    estimated_minutes: estimateSeedMinutes(input.type, input.points),
    difficulty: estimateSeedDifficulty(input.type, input.points),
    task_type: input.type,
    priority_score: 0,
    risk_level: "LOW",
    progress_percent: 100,
    canvas_submission_confirmed: true,
    notes: "Backfilled from Spring 2026 Canvas grades/modules PDFs.",
    url: null,
    source: "canvas",
  };
}

function estimateSeedMinutes(type: TaskType, points: number | null) {
  if (type === "final" || type === "exam") return 120;
  if (type === "essay" || type === "paper" || type === "project") return points && points >= 100 ? 240 : 150;
  if (type === "discussion") return 75;
  if (type === "quiz" || type === "extra_credit") return 45;
  return 90;
}

function estimateSeedDifficulty(type: TaskType, points: number | null): AssignmentDifficulty {
  if (type === "final" || type === "exam" || (points ?? 0) >= 100) return "heavy";
  if (type === "essay" || type === "paper" || type === "project" || (points ?? 0) >= 30) return "medium";
  return "light";
}

export const semesterStart = "2026-08-31";
export const semesterEnd = "2026-12-20";
export const schoolTimeZone = "America/Los_Angeles";

export type TermStatus = "active" | "archived" | "upcoming";
export type TermSeason = "winter" | "spring" | "summer" | "fall";

export interface TermConfig {
  id: string;
  label: string;
  year: number;
  season: TermSeason;
  status: TermStatus;
}

export const termConfigs: TermConfig[] = [
  {
    id: "2026-spring",
    label: "Spring 2026",
    year: 2026,
    season: "spring",
    status: "archived",
  },
  {
    id: "2026-summer",
    label: "Summer 2026",
    year: 2026,
    season: "summer",
    status: "archived",
  },
  {
    id: "2026-fall",
    label: "Fall 2026",
    year: 2026,
    season: "fall",
    status: "active",
  },
  {
    id: "2027-winter",
    label: "Winter 2027",
    year: 2027,
    season: "winter",
    status: "upcoming",
  },
  {
    id: "2027-spring",
    label: "Spring 2027",
    year: 2027,
    season: "spring",
    status: "upcoming",
  },
];

export function getActiveTermConfig() {
  return termConfigs.find((term) => term.status === "active") ?? termConfigs[0];
}

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
    title: "Operating Systems: Beginning Linux",
    term_label: "Fall 2026",
    course_status: "upcoming",
    campus: "LACC FH 201",
    modality: "Online lecture + Thu lab 14:30-17:40",
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
    title: "Introduction to Cybersecurity I",
    term_label: "Fall 2026",
    course_status: "upcoming",
    campus: "City Online",
    modality: "Online lecture + Sat live Zoom 14:00-18:00",
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
    modality: "Online live Zoom Mon/Wed 11:00-12:15",
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
    title: "Introduction to Network Plus",
    term_label: "Fall 2026",
    course_status: "upcoming",
    campus: "Zoom",
    modality: "Online live Zoom Tue 15:00-17:00",
    units: 3,
    final_grade: null,
    starts_on: semesterStart,
    ends_on: semesterEnd,
    weekly_hours: 4.17,
    color: "#c2410c",
    source: "syllabus",
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
    final_grade: "A",
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
    title: "Introduction to Computer Networking",
    term_label: "Summer 2026",
    course_status: "case_study",
    campus: "City Online",
    modality: "Online live Zoom Mon/Wed 09:00-11:00; recordings posted",
    units: 3,
    final_grade: "A",
    starts_on: "2026-06-15",
    ends_on: "2026-08-09",
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
    campus: "LACC FH 221",
    modality: "Lecture Wed 14:20-15:45",
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
    title: "Introduction to Computer Science",
    term_label: "Spring 2026",
    course_status: "case_study",
    campus: "Zoom",
    modality: "Online lecture + Tue/Thu lab 11:10-12:35",
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
    canvas_course_id: 341495,
    code: "ENGL C1000",
    title: "Academic Reading & Writing",
    term_label: "Spring 2026",
    course_status: "case_study",
    campus: "Zoom",
    modality: "Online Lecture Wed 18:50-22:00",
    units: 3,
    final_grade: "A",
    starts_on: "2026-02-09",
    ends_on: "2026-06-08",
    weekly_hours: 0,
    color: "#047857",
    source: "user",
  },
  {
    id: "health-101",
    canvas_course_id: 341642,
    code: "HEALTH 101",
    title: "Introduction to Public Health",
    term_label: "Spring 2026",
    course_status: "case_study",
    campus: "City Online",
    modality: "8-week self-paced online public health course",
    units: 3,
    final_grade: "A",
    starts_on: "2026-04-13",
    ends_on: "2026-06-08",
    weekly_hours: 0,
    color: "#0891b2",
    source: "user",
  },
  {
    id: "co-tech-002",
    canvas_course_id: null,
    code: "CO TECH 002",
    title: "Introduction to Electronics",
    term_label: "Winter 2027",
    course_status: "upcoming",
    campus: "Student Educational Plan",
    modality: "Planned course from Student Educational Plan; schedule TBA",
    units: 3,
    final_grade: null,
    starts_on: "2027-01-04",
    ends_on: "2027-02-06",
    weekly_hours: 0,
    color: "#0369a1",
    source: "user",
  },
  {
    id: "fam-cs-021",
    canvas_course_id: null,
    code: "FAM CS 021",
    title: "Nutrition",
    term_label: "Winter 2027",
    course_status: "upcoming",
    campus: "Student Educational Plan",
    modality: "Planned course from Student Educational Plan; schedule TBA",
    units: 3,
    final_grade: null,
    starts_on: "2027-01-04",
    ends_on: "2027-02-06",
    weekly_hours: 0,
    color: "#65a30d",
    source: "user",
  },
  {
    id: "cis-212",
    canvas_course_id: null,
    code: "CIS 212",
    title: "A+ Cert Prep HW",
    term_label: "Spring 2027",
    course_status: "upcoming",
    campus: "Student Educational Plan",
    modality: "Planned course from Student Educational Plan; schedule TBA",
    units: 3,
    final_grade: null,
    starts_on: "2027-02-09",
    ends_on: "2027-06-08",
    weekly_hours: 0,
    color: "#1d4ed8",
    source: "user",
  },
  {
    id: "cis-213",
    canvas_course_id: null,
    code: "CIS 213",
    title: "A+ Operating Systems",
    term_label: "Spring 2027",
    course_status: "upcoming",
    campus: "Student Educational Plan",
    modality: "Planned course from Student Educational Plan; schedule TBA",
    units: 3,
    final_grade: null,
    starts_on: "2027-02-09",
    ends_on: "2027-06-08",
    weekly_hours: 0,
    color: "#7c3aed",
    source: "user",
  },
  {
    id: "cis-211",
    canvas_course_id: null,
    code: "CIS 211",
    title: "Security+ Preparation",
    term_label: "Spring 2027",
    course_status: "upcoming",
    campus: "Student Educational Plan",
    modality: "Planned course from Student Educational Plan; schedule TBA",
    units: 3,
    final_grade: null,
    starts_on: "2027-02-09",
    ends_on: "2027-06-08",
    weekly_hours: 0,
    color: "#be123c",
    source: "user",
  },
  {
    id: "cis-170",
    canvas_course_id: null,
    code: "CIS 170",
    title: "Introduction to Ethical Hacking",
    term_label: "Spring 2027",
    course_status: "upcoming",
    campus: "Student Educational Plan",
    modality: "Planned course from Student Educational Plan; schedule TBA",
    units: 3,
    final_grade: null,
    starts_on: "2027-02-09",
    ends_on: "2027-06-08",
    weekly_hours: 0,
    color: "#0f766e",
    source: "user",
  },
  {
    id: "cis-191",
    canvas_course_id: null,
    code: "CIS 191",
    title: "Cloud+ Tech",
    term_label: "Spring 2027",
    course_status: "upcoming",
    campus: "Student Educational Plan",
    modality: "Planned course from Student Educational Plan; schedule TBA",
    units: 3,
    final_grade: null,
    starts_on: "2027-02-09",
    ends_on: "2027-06-08",
    weekly_hours: 0,
    color: "#0891b2",
    source: "user",
  },
];

const springHistoricalAssignments: Assignment[] = [
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-02-13",
    id: "introduce-yourself-alive-in-los-angeles",
    points: 20,
    title: "Introduce yourself to the class! Alive in Los Angeles!",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-02-13",
    id: "syllabus-quiz",
    points: 15,
    title: "Syllabus Quiz",
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-02-15",
    id: "essay-introduction-to-la-conversation",
    points: 50,
    title: "Essay: Introduction to The L.A. Conversation",
    type: "essay",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-02-16",
    id: "quiz-1-lost-la-wild-la",
    points: 6,
    title: 'Quiz 1: Lost LA: S1, E1 "Wild LA"',
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-02-22",
    id: "commentary-1-in-the-beginning",
    points: 20,
    title: 'Commentary 1: "In the Beginning"',
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-02-22",
    id: "practice-email-corrigan-mcnabb",
    points: 10,
    title: "Practice Email re: Corrigan and McNabb",
    type: "assignment",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-02-23",
    id: "quiz-2-lost-la-before-the-dodgers",
    points: 18,
    title: 'Quiz 2: Lost LA: S1, E2 "Before the Dodgers"',
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-03-01",
    id: "commentary-2-how-history-stays-with-us",
    points: 20,
    title: 'Commentary #2: "How History Stays With Us"',
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-03-02",
    id: "quiz-3-lost-la-reshaping-la",
    points: 10,
    title: 'QUIZ 3: Lost LA: S1, E3 "Reshaping LA"',
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-03-08",
    id: "commentary-3-contemporary-visions-los-angeles",
    points: 20,
    title: 'Commentary #3: "Contemporary Visions of Los Angeles"',
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-03-09",
    id: "quiz-4-lost-la-descanso-gardens",
    points: 20,
    title: 'QUIZ 4: Lost LA: S1, E4 "Descanso Gardens"',
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-03-15",
    id: "commentary-4-reflections-la-basin",
    points: 20,
    title: 'Commentary #4: "Reflections on the L.A. Basin"',
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-03-22",
    id: "choose-topic-final-project",
    points: 30,
    title: "Choose a Topic for Your Final Project",
    type: "project",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-03-22",
    id: "practice-audit-assignment",
    points: 50,
    title: "Practice Audit Assignment",
    type: "assignment",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-03-22",
    id: "rhetorical-analysis-essay-la-conversation",
    points: 105,
    title: "Rhetorical Analysis Essay: Getting into the L.A. Conversation",
    type: "essay",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-03-23",
    id: "quiz-5-lost-la-borderlands",
    points: 15,
    title: 'QUIZ 5: Lost LA: S2, E1 "Borderlands"',
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-03-29",
    id: "commentary-5-new-ideas-about-place",
    points: 20,
    title: 'Commentary #5: "New Ideas About Place"',
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-03-30",
    id: "quiz-6-lost-la-wild-west",
    points: 15,
    title: 'QUIZ 6: Lost LA: S2, E2 "Wild West"',
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-04-02",
    id: "annotated-bibliography",
    points: 15,
    title: "Annotated Bibliography",
    type: "research_assignment",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-04-05",
    id: "commentary-6-new-ideas-about-the-land",
    points: 20,
    title: 'Commentary #6: "New Ideas About the Land"',
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-04-13",
    id: "quiz-7-lost-la-building-metropolis",
    points: 15,
    title: 'QUIZ 7: Lost LA: S2, E3 "Building the Metropolis"',
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-04-19",
    id: "commentary-7-fox-wrap-up",
    points: 20,
    title: "Commentary #7: Fox Wrap-Up",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-04-19",
    id: "mla-video-lecture-discussion",
    points: 20,
    title: "MLA Video Lecture & Discussion",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-04-27",
    id: "quiz-8-lost-la-dream-factory",
    points: 10,
    title: 'QUIZ 8: Lost LA: S2, E4 "The Dream Factory"',
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-05-03",
    id: "commentary-8-los-angeles-like-movies",
    points: 20,
    title: "Commentary #8: Is Los Angeles Like the Movies?",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-05-03",
    id: "i-search-paper",
    points: 115,
    title: "I-Search Paper Due Here",
    type: "paper",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-05-04",
    id: "quiz-9-lost-la-coded-geographies",
    points: 12,
    title: 'QUIZ 9: Lost LA: S2, E5 "Coded Geographies"',
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-05-10",
    id: "commentary-9-whats-in-a-map",
    points: 20,
    title: 'Commentary #9: "What\'s in a map?"',
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-05-11",
    id: "quiz-10-lost-la-pacific-rim",
    points: 20,
    title: 'QUIZ 10: Lost LA: S2, E6 "Pacific Rim"',
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-05-17",
    id: "commentary-10-coming-to-terms-with-los-angeles",
    points: 20,
    title: 'Commentary #10: "Coming to Terms With Los Angeles"',
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-05-24",
    id: "final-audit",
    points: 100,
    title: "Final Audit",
    type: "final",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-05-24",
    id: "los-angeles-chapter-final-writing-project",
    points: 650,
    title: "Los Angeles Chapter (Final Writing Project)",
    type: "final",
  }),
  completedAssignmentSeed({
    courseId: "engl-c1000",
    dueDate: "2026-06-03",
    id: "final-exam-c1000",
    points: 65,
    title: "Final Exam C1000",
    type: "final",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-04-18",
    id: "assignment-1-defining-public-health-personal-health",
    points: 12,
    title: "Assignment #1: Defining Public Health and Personal Health",
    type: "assignment",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-04-18",
    id: "assignment-2-framework-disciplines-careers",
    points: 20,
    title: "Assignment #2- Framework, Disciplines and Careers in Public Health",
    type: "assignment",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-04-18",
    id: "introductions-discussion",
    points: 10,
    title: "Introductions Discussion",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-04-18",
    id: "week-1-discussion",
    points: 20,
    title: "Week 1 Discussion",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-04-25",
    id: "quiz-1-chapters-1-4",
    points: 20,
    title: "Quiz 1: Chapters 1-4",
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-04-25",
    id: "week-2-discussion-a-outbreak-investigation",
    points: 10,
    title: "Week 2 Discussion A: Outbreak investigation",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-04-25",
    id: "week-2-discussion-b-disease-prevention",
    points: 20,
    title: "Week 2 Discussion B: Disease Prevention Activity",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-05-02",
    id: "quiz-2-chapters-5-7",
    points: 15,
    title: "Quiz 2: Chapters 5 and 7",
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-05-02",
    id: "unit-5-discussion-maternal-infant-child-health",
    points: 20,
    title: "Unit 5 Discussion- Maternal, Infant, and Child Health",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-05-09",
    id: "chapter-8-discussion-violence-suicide-prevention",
    points: 12,
    title: "Chapter 8 Discussion: Violence / Suicide prevention in children",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-05-09",
    id: "extra-credit-quiz-chapter-6",
    points: 0,
    title: "Extra Credit Quiz: Chapter 6",
    type: "extra_credit",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-05-09",
    id: "quiz-3-chapters-8-9",
    points: 20,
    title: "Quiz 3: Chapters 8 & 9",
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-05-16",
    id: "chapter-10-discussion",
    points: 15,
    title: "Chapter 10 Discussion",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-05-16",
    id: "quiz-4-chapters-10-11",
    points: 15,
    title: "Quiz 4: Chapters 10 & 11",
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-05-23",
    id: "discussion-chapter-13-healthcare-delivery",
    points: 10,
    title: "Discussion- Chapter 13 Healthcare Delivery in the US",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-05-23",
    id: "quiz-5-chapters-12-13",
    points: 15,
    title: "Quiz 5: Chapters 12 & 13",
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-05-30",
    id: "chapter-14-discussion-environmental-issues",
    points: 20,
    title: "Chapter 14 Discussion: Environmental Issues in Public Health",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-05-30",
    id: "chapter-15-discussion-injuries-community-health",
    points: 15,
    title: "Chapter 15 Discussion: Injuries as a Community and Public Health Issue",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-05-30",
    id: "quiz-6-chapters-14-15",
    points: 20,
    title: "Quiz 6: Chapters 14 & 15",
    type: "quiz",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-06-06",
    id: "concluding-thoughts-discussion-slo",
    points: 20,
    title: "Concluding Thoughts Discussion: SLO",
    type: "discussion",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-06-06",
    id: "extra-credit-quiz-chapter-16",
    points: 0,
    title: "Extra Credit Quiz: Chapter 16",
    type: "extra_credit",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-06-06",
    id: "final-exam",
    points: 42,
    title: "Final Exam",
    type: "final",
  }),
  completedAssignmentSeed({
    courseId: "health-101",
    dueDate: "2026-06-06",
    id: "course-exit-survey",
    points: null,
    title: "Course Exit Survey",
    type: "other",
  }),
];

export const seedAssignments: Assignment[] = [
  ...springHistoricalAssignments,
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
    hour: "2-digit",
    hour12: false,
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
