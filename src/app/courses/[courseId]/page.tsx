import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CalendarDays, CheckCircle2, ExternalLink, FileText, Flag } from "lucide-react";
import {
  classTypeLinesFor,
  classTypeSummaryFor,
  displayCourseTitleFor,
  courseOutcome,
  instructorFor,
  professorRatingLineFor,
  pointsLabel,
  sanitizeSnippet,
  sourceProofFor,
  submissionClass,
  submissionLabel,
  taskTypeLabels,
  topicsFor,
  totalPoints,
} from "@/lib/course-meta";
import { getDashboardData } from "@/lib/dashboard-data";
import { formatShortDate, schoolTimeZone, termConfigs } from "@/lib/semester";
import type { Assignment, Course, TermConfig } from "@/lib/semester";

type CoursePageProps = {
  params: Promise<{
    courseId: string;
  }>;
  searchParams?: Promise<{
    view?: string;
  }>;
};

type CourseRoomTab = {
  href: string;
  id: string;
  label: string;
};

export default async function CoursePage({ params, searchParams }: CoursePageProps) {
  const { courseId } = await params;
  const query = searchParams ? await searchParams : {};
  const { courses, courseAssignments } = await getDashboardData();
  const course = courses.find((item) => item.id === courseId);

  if (!course) {
    notFound();
  }

  const assignments = courseAssignments.filter((assignment) => assignment.course_id === course.id);
  const outcome = courseOutcome(course);
  const classTypeSummary = classTypeSummaryFor(course);
  const roomTabs = buildCourseRoomTabs(course, assignments);
  const requestedView = query.view;
  const activeView = requestedView && roomTabs.some((tab) => tab.id === requestedView) ? requestedView : "overview";
  const visibleAssignments = assignmentsForView(assignments, activeView);
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
              </div>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal md:text-6xl">
                {displayCourseTitleFor(course)}
              </h1>
              <p className="mt-3 text-slate-600">
                {course.term_label} · {course.units} units · {classTypeSummary}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-600">{outcome === "In progress" ? "Current Status" : "Final Grade"}</p>
              <p className="mt-2 text-3xl font-semibold">{outcome}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard icon={<BookOpen />} label="Assignments" value={assignments.length.toString()} />
            <StatCard icon={<FileText />} label="Points Possible" value={points ? `${points}` : "N/A"} />
            <StatCard icon={<CheckCircle2 />} label="Status" value={outcome} />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">Course Information</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <InfoItem label="Semester" value={course.term_label} />
              <InfoItem label="Dates" value={`${course.starts_on} to ${course.ends_on}`} />
              <InfoItem label="Grades" value={outcome} />
              <InfoItem
                label="Instructor"
                value={
                  <>
                    <span>{instructorFor(course)}</span>
                    <span className="mt-1 block text-xs font-semibold text-slate-500">({professorRatingLineFor(course)})</span>
                  </>
                }
              />
              <InfoItem
                label="Class Type"
                value={classTypeLinesFor(course).map((line) => (
                  <span className="block" key={line}>
                    {line}
                    {line === "(Asynchronous)" ? (
                      <span className="ml-2 inline-block rounded bg-sky-50 px-1.5 py-0.5 align-middle text-xs font-semibold text-sky-700">Async</span>
                    ) : null}
                  </span>
                ))}
              />
              <InfoItem label="Location / Campus" value={course.campus} />
              <InfoItem label="Canvas Course ID" value={course.canvas_course_id ? `${course.canvas_course_id}` : "Not synced yet"} />
            </div>
            <SourceProofList course={course} />
          </div>
        </div>

        <div className="space-y-6">
          <CourseRoomTabs activeView={activeView} tabs={roomTabs} />
          {activeView === "overview" ? (
            <>
              <CourseOverviewInsights assignments={assignments} course={course} />
              <CourseStrategy assignments={assignments} course={course} />
            </>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white">
              <div className="border-b border-slate-200 p-5">
                <h2 className="text-xl font-semibold">{assignmentPanelTitle(activeView, roomTabs)}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Pulled from synced Student Star data. Tabs above split this course by month and assignment list.
                </p>
              </div>

              {visibleAssignments.length ? (
                <div className="divide-y divide-slate-200">
                  {visibleAssignments.map((assignment) => (
                    <AssignmentRow assignment={assignment} key={assignment.id} />
                  ))}
                </div>
              ) : assignments.length ? (
                <div className="p-5">
                  <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    No assignments match this tab yet. Switch to Assignments to see the full synced list.
                  </p>
                </div>
              ) : (
                <ArchivedSummary course={course} />
              )}
            </div>
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

function buildCourseRoomTabs(course: Course, assignments: Assignment[]): CourseRoomTab[] {
  const baseHref = `/courses/${course.id}`;
  const monthTabs = monthGroups(assignments).map((month) => ({
    href: `${baseHref}?view=${month.id}`,
    id: month.id,
    label: month.label,
  }));

  return [
    { href: baseHref, id: "overview", label: "Overview" },
    ...monthTabs,
    { href: `${baseHref}?view=assignments`, id: "assignments", label: "Assignments" },
  ];
}

function CourseRoomTabs({ activeView, tabs }: { activeView: string; tabs: CourseRoomTab[] }) {
  return (
    <nav aria-label="Course room sections" className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-1.5">
      <div className="flex min-w-max gap-1.5">
        {tabs.map((tab) => {
          const isActive = tab.id === activeView;
          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                isActive ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
              href={tab.href}
              key={tab.id}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function assignmentPanelTitle(activeView: string, tabs: CourseRoomTab[]) {
  if (activeView === "assignments") return "All Assignments";
  return `${tabs.find((tab) => tab.id === activeView)?.label ?? "Monthly"} Assignments`;
}

function assignmentsForView(assignments: Assignment[], activeView: string) {
  if (activeView === "overview" || activeView === "assignments") return assignments;

  return assignments.filter((assignment) => assignmentMonthKey(assignment.due_at) === activeView);
}

function monthGroups(assignments: Assignment[]) {
  const months = new Map<string, string>();

  assignments.forEach((assignment) => {
    const id = assignmentMonthKey(assignment.due_at);
    if (!id || months.has(id)) return;
    months.set(id, assignmentMonthLabel(assignment.due_at));
  });

  return Array.from(months.entries()).map(([id, label]) => ({ id, label }));
}

function assignmentMonthKey(value: string | null) {
  if (!value) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: schoolTimeZone,
    year: "numeric",
  }).formatToParts(new Date(value));
  const month = parts.find((part) => part.type === "month")?.value.toLowerCase();
  const year = parts.find((part) => part.type === "year")?.value;
  return month && year ? `${month}-${year}` : null;
}

function assignmentMonthLabel(value: string | null) {
  if (!value) return "No Month";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: schoolTimeZone,
    year: "numeric",
  }).format(new Date(value));
}

function CourseOverviewInsights({ assignments, course }: { assignments: Assignment[]; course: Course }) {
  const submittedCount = assignments.filter((assignment) => assignment.canvas_submission_confirmed).length;
  const gradedCount = assignments.filter((assignment) => assignment.status === "GRADED").length;
  const discussionCount = assignments.filter((assignment) => assignment.task_type === "discussion").length;
  const quizCount = assignments.filter((assignment) => assignment.task_type === "quiz").length;
  const majorExamCount = assignments.filter(isMajorExamAssignment).length;
  const completionRate = percentageLabel(submittedCount, assignments.length);
  const gradedRate = percentageLabel(gradedCount, assignments.length);
  const mainWorkType = mainWorkTypeLabel(assignments);
  const coursePace = coursePaceLabel(course, assignments);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-semibold">{course.code} Summary</h2>
          <p className="mt-1 text-sm text-slate-600">A quick read of the course rhythm before drilling into monthly tabs.</p>
        </div>
        <span className="rounded bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">{courseOutcome(course)}</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <MiniInsight label="Submitted" value={`${submittedCount}/${assignments.length}`} />
        <MiniInsight label="Graded" value={gradedCount.toString()} />
        <MiniInsight label="Discussions" value={discussionCount.toString()} />
        <MiniInsight label="Quizzes" value={quizCount.toString()} />
        <MiniInsight label="Completion Rate" value={completionRate} />
        <MiniInsight label="Graded Rate" value={gradedRate} />
        <MiniInsight label="Main Work Type" value={mainWorkType} />
        <MiniInsight label="Course Pace" value={coursePace} />
        <MiniInsight label="Major Exams" value={majorExamCount.toString()} />
      </div>
    </div>
  );
}

function CourseStrategy({ assignments, course }: { assignments: Assignment[]; course: Course }) {
  const months = monthGroups(assignments);
  const highPointTasks = assignments.filter((assignment) => (assignment.points_possible ?? 0) >= 10).length;

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
      <h2 className="text-xl font-semibold text-slate-950">A Strategy from {course.code}</h2>
      <p className="mt-2 text-sm text-slate-700">
        This course is useful as a case study because it shows the rhythm of a recently completed online class: frequent
        small Canvas items, module unlock work, and steady submission proof.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <MiniInsight label="Active months" value={months.length.toString()} />
        <MiniInsight label="High-point tasks" value={highPointTasks.toString()} />
        <MiniInsight label="Final outcome" value={courseOutcome(course)} />
      </div>
      <div className="mt-4 grid gap-2 text-sm text-slate-700">
        <StrategyStep text="Use month tabs to see where workload spikes happened." />
        <StrategyStep text="Treat 0-point unlock tasks as required work, not optional noise." />
        <StrategyStep text="Keep proof for every submitted item so future classes can copy the same habit." />
        <StrategyStep text={`${mainWorkTypeLabel(assignments)} means the winning habit is steady weekly completion, not one big final sprint.`} />
      </div>
    </div>
  );
}

function MiniInsight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function StrategyStep({ text }: { text: string }) {
  return (
    <div className="flex gap-2 rounded-lg bg-white/70 px-3 py-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
      <span>{text}</span>
    </div>
  );
}

function AssignmentRow({ assignment }: { assignment: Assignment }) {
  const guide = assignment.notes ? sanitizeSnippet(assignment.notes) : null;
  const isComplete = assignment.status === "GRADED" || assignment.canvas_submission_confirmed;
  const majorExamLabel = majorExamAssignmentLabel(assignment);

  return (
    <article
      className={`p-5 ${
        majorExamLabel ? "border-l-4 border-amber-400 bg-amber-50/50" : ""
      }`}
    >
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {taskTypeLabels[assignment.task_type]}
            </span>
            <span className={`rounded px-2 py-1 text-xs font-semibold ${submissionClass(assignment.status, assignment.canvas_submission_confirmed)}`}>
              {submissionLabel(assignment.status, assignment.canvas_submission_confirmed)}
            </span>
            {majorExamLabel ? (
              <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                <Flag className="h-3 w-3" />
                {majorExamLabel}
              </span>
            ) : null}
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
            className={`inline-flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold hover:border-slate-400 ${
              isComplete ? "border-slate-100 text-slate-500" : "border-slate-200 text-slate-700"
            }`}
            href={assignment.url}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="h-4 w-4" />
            Canvas
          </a>
        ) : null}
      </div>

      {guide ? (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <p>{guide}</p>
        </div>
      ) : null}
    </article>
  );
}

function percentageLabel(part: number, total: number) {
  if (total === 0) return "N/A";
  return `${Math.round((part / total) * 1000) / 10}%`;
}

function isMajorExamAssignment(assignment: Assignment) {
  return majorExamAssignmentLabel(assignment) !== null;
}

function majorExamAssignmentLabel(assignment: Assignment) {
  const title = assignment.title.toLowerCase();

  if (assignment.task_type === "final" || title.includes("final exam") || title.includes("final")) return "Final Exam";
  if (assignment.task_type === "midterm" || title.includes("midterm") || title.includes("mid-term")) return "Midterm";
  if (assignment.task_type === "exam" || title.includes("exam")) return "Exam";

  return null;
}

function mainWorkTypeLabel(assignments: Assignment[]) {
  if (assignments.length === 0) return "N/A";
  const counts = new Map<Assignment["task_type"], number>();

  assignments.forEach((assignment) => {
    counts.set(assignment.task_type, (counts.get(assignment.task_type) ?? 0) + 1);
  });

  const [taskType, count] = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];
  return `${taskTypeLabels[taskType]}-heavy (${count})`;
}

function coursePaceLabel(course: Course, assignments: Assignment[]) {
  const start = new Date(`${course.starts_on}T00:00:00`);
  const end = new Date(`${course.ends_on}T00:00:00`);
  const weeks = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)));
  const weeklyLoad = assignments.length / weeks;

  if (weeks <= 8 || weeklyLoad >= 4) return "Accelerated";
  if (weeklyLoad >= 2) return "Steady";
  return "Light";
}

function ArchivedSummary({ course }: { course: Course }) {
  const outcome = courseOutcome(course);

  return (
    <div className="p-5">
      <h3 className="font-semibold">Verified Course Outcome</h3>
      <p className="mt-2 text-sm text-slate-600">
        {outcome !== "In progress" ? `Completed with ${outcome}.` : "No granular assignments are synced for this course yet."}
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

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  );
}

function SourceProofList({ course }: { course: Course }) {
  return (
    <div className="mt-4 rounded-md border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Source Proof</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {sourceProofFor(course).map((proof) => (
          <span className="rounded bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700" key={proof}>
            {proof}
          </span>
        ))}
      </div>
    </div>
  );
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
