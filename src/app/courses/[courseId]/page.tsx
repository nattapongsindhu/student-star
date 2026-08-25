import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CalendarDays, CheckCircle2, ExternalLink, FileText } from "lucide-react";
import {
  courseOutcome,
  instructorFor,
  pointsLabel,
  sanitizeSnippet,
  sourceBadgeClass,
  sourceLabels,
  submissionClass,
  submissionLabel,
  taskTypeLabels,
  topicsFor,
  totalPoints,
} from "@/lib/course-meta";
import { getDashboardData } from "@/lib/dashboard-data";
import { formatShortDate, termConfigs } from "@/lib/semester";
import type { Assignment, Course, TermConfig } from "@/lib/semester";

type CoursePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  const { courses, courseAssignments } = await getDashboardData();
  const course = courses.find((item) => item.id === courseId);

  if (!course) {
    notFound();
  }

  const assignments = courseAssignments.filter((assignment) => assignment.course_id === course.id);
  const points = totalPoints(assignments);
  const backTerm = termConfigs.find((term) => term.label === course.term_label);
  const backHref = termHref(backTerm);
  const backLabel = backTerm?.label ?? course.term_label;

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800" href={backHref}>
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>

          <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-teal-800">{course.code}</p>
                <SourceBadge source={course.source} />
              </div>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal md:text-6xl">{course.title}</h1>
              <p className="mt-3 text-slate-600">
                {course.term_label} · {course.units} units · {course.modality}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-600">{course.final_grade ? "Final Grade" : "Current Status"}</p>
              <p className="mt-2 text-3xl font-semibold">{courseOutcome(course)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard icon={<BookOpen />} label="Assignments" value={assignments.length.toString()} />
            <StatCard icon={<FileText />} label="Points Possible" value={points ? `${points}` : "N/A"} />
            <StatCard icon={<CheckCircle2 />} label="Status" value={courseOutcome(course)} />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">Course Information</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <InfoItem label="Semester" value={course.term_label} />
              <InfoItem label="Dates" value={`${course.starts_on} to ${course.ends_on}`} />
              <InfoItem label="Instructor" value={instructorFor(course)} />
              <InfoItem label="Class Type" value={course.modality} />
              <InfoItem label="Location / Campus" value={course.campus} />
              <InfoItem label="Canvas Course ID" value={course.canvas_course_id ? `${course.canvas_course_id}` : "Not synced yet"} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-semibold">Assignment Breakdown</h2>
            <p className="mt-2 text-sm text-slate-600">
              Pulled from synced Student Star data. Use the Canvas button when you need the official submission page.
            </p>
          </div>

          {assignments.length ? (
            <div className="divide-y divide-slate-200">
              {assignments.map((assignment) => (
                <AssignmentRow assignment={assignment} key={assignment.id} />
              ))}
            </div>
          ) : (
            <ArchivedSummary course={course} />
          )}
        </div>
      </section>
    </main>
  );
}

function termHref(term: TermConfig | undefined) {
  if (!term) return "/";
  return `/?term=${term.id}`;
}

function AssignmentRow({ assignment }: { assignment: Assignment }) {
  const guide = sanitizeSnippet(assignment.notes);

  return (
    <article className="p-5">
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
          <h3 className="mt-2 text-lg font-semibold text-slate-950">{assignment.title}</h3>
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
        <p>{guide}</p>
      </div>
    </article>
  );
}

function ArchivedSummary({ course }: { course: Course }) {
  return (
    <div className="p-5">
      <h3 className="font-semibold">Verified Course Outcome</h3>
      <p className="mt-2 text-sm text-slate-600">
        {course.final_grade ? `Completed with ${course.final_grade}.` : "No granular assignments are synced for this course yet."}
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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  );
}

function SourceBadge({ source }: { source: Course["source"] }) {
  return <span className={`rounded px-2 py-1 text-xs font-medium ${sourceBadgeClass(source)}`}>{sourceLabels[source]}</span>;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
        <span className="text-teal-700 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
