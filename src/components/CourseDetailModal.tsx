"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { BookOpen, CalendarDays, CheckCircle2, ExternalLink, FileText, X } from "lucide-react";
import { formatShortDate } from "@/lib/semester";
import type { Assignment, Course } from "@/lib/semester";
import type { SourceKind, TaskStatus, TaskType } from "@/types/academic";

type CourseDetailCardProps = {
  assignments: Assignment[];
  course: Course;
  variant: "active" | "case_study" | "archived";
};

const sourceLabels: Record<SourceKind, string> = {
  ai_inference: "AI",
  canvas: "Live Canvas",
  mock: "Local Seed",
  syllabus: "Syllabus",
  user: "Manual",
};

const taskTypeLabels: Record<TaskType, string> = {
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

function sourceBadgeClass(source: SourceKind) {
  if (source === "canvas") return "bg-emerald-50 text-emerald-800";
  if (source === "mock") return "bg-slate-100 text-slate-700";
  if (source === "user") return "bg-sky-50 text-sky-800";
  if (source === "syllabus") return "bg-amber-50 text-amber-800";
  return "bg-violet-50 text-violet-800";
}

function sanitizeSnippet(value: string | null) {
  if (!value) return "No assignment guide is available yet.";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 420);
}

function submissionLabel(status: TaskStatus, confirmed: boolean) {
  if (status === "GRADED") return "Graded";
  if (status === "CANVAS_CONFIRMED" || confirmed) return "Submitted";
  if (status === "USER_MARKED_SUBMITTED") return "Marked Submitted";
  return "Unsubmitted / Missing";
}

function submissionClass(status: TaskStatus, confirmed: boolean) {
  if (status === "GRADED") return "bg-emerald-50 text-emerald-800";
  if (status === "CANVAS_CONFIRMED" || confirmed || status === "USER_MARKED_SUBMITTED") {
    return "bg-sky-50 text-sky-800";
  }
  return "bg-amber-50 text-amber-800";
}

function pointsLabel(assignment: Assignment) {
  if (assignment.status === "GRADED" && assignment.points_possible !== null) {
    return `${assignment.points_possible} pts · Graded`;
  }
  return assignment.points_possible !== null ? `${assignment.points_possible} pts` : "No points listed";
}

function totalPoints(assignments: Assignment[]) {
  return assignments.reduce((sum, assignment) => sum + (assignment.points_possible ?? 0), 0);
}

function courseOutcome(course: Course) {
  if (course.final_grade) return course.final_grade;
  if (course.course_status === "case_study") return "Verified outcome";
  return "In progress";
}

function instructorFor(course: Course) {
  if (course.code === "CIS 166") return "Allan Pratt";
  if (course.code === "CIS 162") return "Ray Lampano, Jr.";
  return "Instructor not synced yet";
}

function formatCourseDateRange(course: Course) {
  return `${course.starts_on} to ${course.ends_on}`;
}

function topicsFor(course: Course) {
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

export function CourseDetailCard({ assignments, course, variant }: CourseDetailCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const totalAssignmentPoints = useMemo(() => totalPoints(assignments), [assignments]);
  const isCaseStudy = variant !== "active" || course.course_status === "case_study";

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="w-full cursor-pointer rounded-lg border border-slate-200 p-4 text-left transition-all hover:border-slate-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold" style={{ color: course.color }}>
              {course.code}
            </p>
            <h3 className={variant === "active" ? "mt-1 text-lg font-semibold" : "mt-1 font-semibold"}>{course.title}</h3>
          </div>
          <span
            className={`rounded px-2 py-1 text-sm font-medium ${
              course.final_grade ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700"
            }`}
          >
            {course.final_grade ?? (isCaseStudy ? "Case Study" : "Active")}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SourceBadge source={course.source} />
          <span className="text-sm text-slate-600">{course.term_label}</span>
        </div>
        {variant === "active" ? (
          <>
            <p className="mt-3 text-sm text-slate-600">{course.modality}</p>
            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${Math.min(100, course.weekly_hours * 10)}%`,
                  backgroundColor: course.color,
                }}
              />
            </div>
            <p className="mt-2 text-xs font-medium text-slate-500">
              {course.starts_on} to {course.ends_on} · {assignments.length} assignments
            </p>
          </>
        ) : null}
      </button>

      {isOpen ? (
        <div
          aria-labelledby={titleId}
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm"
          onMouseDown={() => setIsOpen(false)}
          role="dialog"
        >
          <section
            className="flex h-full w-full max-w-3xl flex-col overflow-y-auto bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-teal-800">{course.code}</p>
                    <SourceBadge source={course.source} />
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950" id={titleId}>
                    {course.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {course.units} units · {course.modality}
                  </p>
                </div>
                <button
                  aria-label="Close course details"
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div className="space-y-5 p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard icon={<BookOpen />} label="Assignments" value={assignments.length.toString()} />
                <StatCard icon={<FileText />} label="Points Possible" value={totalAssignmentPoints ? `${totalAssignmentPoints}` : "N/A"} />
                <StatCard icon={<CheckCircle2 />} label={course.final_grade ? "Final Grade" : "Current Status"} value={courseOutcome(course)} />
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-semibold">Course Information</h3>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <InfoItem label="Semester" value={course.term_label} />
                  <InfoItem label="Dates" value={formatCourseDateRange(course)} />
                  <InfoItem label="Instructor" value={instructorFor(course)} />
                  <InfoItem label="Class Type" value={course.modality} />
                  <InfoItem label="Location / Campus" value={course.campus} />
                  <InfoItem label="Canvas Course ID" value={course.canvas_course_id ? `${course.canvas_course_id}` : "Not synced yet"} />
                </div>
              </div>

              {assignments.length ? (
                <div className="rounded-lg border border-slate-200">
                  <div className="border-b border-slate-200 p-4">
                    <h3 className="font-semibold">Assignment Breakdown</h3>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {assignments.map((assignment) => (
                      <AssignmentRow assignment={assignment} key={assignment.id} />
                    ))}
                  </div>
                </div>
              ) : (
                <ArchivedSummary course={course} />
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  );
}

function AssignmentRow({ assignment }: { assignment: Assignment }) {
  const [expanded, setExpanded] = useState(false);
  const snippet = sanitizeSnippet(assignment.notes);
  const canExpand = snippet.length > 150;

  return (
    <article className="p-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {taskTypeLabels[assignment.task_type]}
            </span>
            <span className={`rounded px-2 py-1 text-xs font-semibold ${submissionClass(assignment.status, assignment.canvas_submission_confirmed)}`}>
              {submissionLabel(assignment.status, assignment.canvas_submission_confirmed)}
            </span>
          </div>
          <h4 className="mt-2 font-semibold text-slate-950">{assignment.title}</h4>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {assignment.due_at ? formatShortDate(assignment.due_at) : "No due date"}
            </span>
            <span>{pointsLabel(assignment)}</span>
          </div>
        </div>
        {assignment.url ? (
          <a
            className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
            href={assignment.url}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="h-4 w-4" />
            Canvas
          </a>
        ) : null}
      </div>

      <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
        <p className={expanded ? "" : "max-h-12 overflow-hidden"}>{snippet}</p>
        {canExpand ? (
          <button className="mt-2 text-sm font-semibold text-teal-800" onClick={() => setExpanded((value) => !value)} type="button">
            {expanded ? "Show less" : "Expand guide"}
          </button>
        ) : null}
      </div>
    </article>
  );
}

function ArchivedSummary({ course }: { course: Course }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <h3 className="font-semibold">Verified Course Outcome</h3>
      <p className="mt-2 text-sm text-slate-600">
        {course.final_grade ? `Completed with ${course.final_grade}.` : "Completed course retained as a planning case study."}
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {topicsFor(course).map((topic) => (
          <span className="rounded-md bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700" key={topic}>
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}

function SourceBadge({ source }: { source: SourceKind }) {
  return <span className={`rounded px-2 py-1 text-xs font-medium ${sourceBadgeClass(source)}`}>{sourceLabels[source]}</span>;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
        <span className="text-teal-700 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
