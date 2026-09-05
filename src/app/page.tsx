import Link from "next/link";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  FlaskConical,
  HomeIcon,
  KanbanSquare,
  Megaphone,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { CanvasTokenAlert } from "@/components/CanvasTokenAlert";
import { AssignmentStatusActions } from "@/components/AssignmentStatusActions";
import { CourseDetailCard } from "@/components/CourseDetailModal";
import { WeeklySchedule } from "@/components/WeeklySchedule";
import { getCanvasAnnouncements } from "@/lib/canvas-announcements";
import { getDashboardData } from "@/lib/dashboard-data";
import {
  daysUntil,
  formatShortDate,
  getActiveTermConfig,
  getPhase,
  termConfigs,
} from "@/lib/semester";
import type { Assignment, Course, TermConfig } from "@/lib/semester";
import { isCanvasComplete } from "@/lib/status";
import { statusLabels } from "@/lib/status";
import { SourceKind } from "@/types/academic";
import type { CanvasAnnouncement } from "@/lib/canvas-announcements";
import type { TaskStatus } from "@/types/academic";

type HomeProps = {
  searchParams?: Promise<{
    focus?: string;
    term?: string;
  }>;
};

type FocusFilter = "due-soon" | "at-risk" | "missing";

const termTabBadges: Record<string, { label: string }> = {
  "2026-spring": {
    label: "Full Time Dean's Honor List",
  },
};

function focusFilterFromParam(value: string | undefined): FocusFilter | null {
  return value === "due-soon" || value === "at-risk" || value === "missing" ? value : null;
}

function assignmentsForFocus(
  focus: FocusFilter | null,
  assignments: {
    atRisk: Assignment[];
    dueSoon: Assignment[];
    missing: Assignment[];
    priority: Assignment[];
  },
) {
  if (focus === "due-soon") return assignments.dueSoon;
  if (focus === "at-risk") return assignments.atRisk;
  if (focus === "missing") return assignments.missing;
  return assignments.priority;
}

function decisionCopyForFocus(focus: FocusFilter | null) {
  if (focus === "due-soon") {
    return {
      title: "Due in 7 days",
      body: "Live Canvas work due soon and not confirmed complete yet.",
    };
  }
  if (focus === "at-risk") {
    return {
      title: "At risk",
      body: "Assignments currently marked high or critical risk.",
    };
  }
  if (focus === "missing") {
    return {
      title: "Missing / mismatch",
      body: "Overdue Canvas work plus items you marked submitted that Canvas has not confirmed yet.",
    };
  }

  return {
    title: "What Should I Do Now?",
    body: "Sorted by deadline pressure, points, progress, workload, and Canvas submission state.",
  };
}

function uniqueAssignments(assignments: Assignment[]) {
  return Array.from(new Map(assignments.map((assignment) => [assignment.id, assignment])).values());
}

export default async function Home({ searchParams }: HomeProps) {
  const params = searchParams ? await searchParams : {};
  const {
    courses,
    assignments,
    courseAssignments,
    lastSyncAt,
    lastAttemptAt,
    syncStatus,
    source,
    lastSyncCourses,
    lastSyncAssignments,
    lastSyncChanges,
    lastSyncError,
  } = await getDashboardData();
  const activeTerm = getActiveTermConfig();
  const requestedTermId = params.term;
  const requestedFocus = focusFilterFromParam(params.focus);
  const selectedTermId = requestedTermId && termConfigs.some((term) => term.id === requestedTermId) ? requestedTermId : "home";
  const isHomeTab = selectedTermId === "home";
  const selectedTerm = termConfigs.find((term) => term.id === selectedTermId) ?? activeTerm;
  const phase = getPhase();
  const selectedTermCourses = courses.filter((course) => course.term_label === selectedTerm.label);
  const activeTermCourses = selectedTermCourses.filter((course) => course.course_status !== "case_study");
  const selectedTermCourseIds = new Set(selectedTermCourses.map((course) => course.id));
  const currentAssignments = assignments.filter((assignment) => selectedTermCourseIds.has(assignment.course_id));
  const liveAssignments = currentAssignments.filter((assignment) => assignment.source === "canvas");
  const priorityAssignments = liveAssignments
    .slice()
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, 6);
  const dueSoon = liveAssignments.filter((assignment) => {
    const days = daysUntil(assignment.due_at);
    return days !== null && days <= 7 && !isCanvasComplete(assignment.status);
  });
  const labCount = liveAssignments.filter((assignment) => assignment.task_type === "lab").length;
  const mismatchAssignments = liveAssignments.filter(
    (assignment) => assignment.status === "USER_MARKED_SUBMITTED" && !assignment.canvas_submission_confirmed,
  );
  const missingAssignments = liveAssignments.filter((assignment) => {
    const days = daysUntil(assignment.due_at);
    return days !== null && days < 0 && !assignment.canvas_submission_confirmed;
  });
  const missingMismatchAssignments = uniqueAssignments([...missingAssignments, ...mismatchAssignments]);
  const atRiskAssignments = liveAssignments.filter(
    (assignment) => assignment.risk_level === "HIGH" || assignment.risk_level === "CRITICAL",
  );
  const decisionAssignments = assignmentsForFocus(requestedFocus, {
    atRisk: atRiskAssignments,
    dueSoon,
    missing: missingMismatchAssignments,
    priority: priorityAssignments,
  });
  const decisionCopy = decisionCopyForFocus(requestedFocus);
  const activeTermCourseAssignments = courseAssignments.filter((assignment) => selectedTermCourseIds.has(assignment.course_id));
  const liveTermAssignments = activeTermCourseAssignments.filter((assignment) => assignment.source === "canvas");
  const upcomingLiveAssignments = liveAssignments.filter((assignment) => {
    const days = daysUntil(assignment.due_at);
    return days !== null && days >= 0 && !isCanvasComplete(assignment.status);
  });
  const todayAssignments = upcomingLiveAssignments.filter((assignment) => daysUntil(assignment.due_at) === 0).slice(0, 4);
  const next72HourAssignments = upcomingLiveAssignments
    .filter((assignment) => {
      const days = daysUntil(assignment.due_at);
      return days !== null && days > 0 && days <= 3;
    })
    .slice(0, 5);
  const nextDueAssignment = upcomingLiveAssignments
    .slice()
    .sort((a, b) => new Date(a.due_at ?? "").getTime() - new Date(b.due_at ?? "").getTime())[0];
  const proofCourse = nextDueAssignment ? courses.find((course) => course.id === nextDueAssignment.course_id) : undefined;
  const highValueCount = liveAssignments.filter((assignment) => (assignment.points_possible ?? 0) >= 100).length;
  const canvasCoverageCount = activeTermCourses.filter((course) => course.source === "canvas").length;
  const announcements = isHomeTab ? await getCanvasAnnouncements(activeTermCourses) : [];

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 lg:px-8">
          <TermSwitcher selectedTabId={selectedTermId} selectedTerm={selectedTerm} />
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                Student Star · {selectedTerm.label}
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal text-slate-950 md:text-5xl">
                Associate in Science in Cybersecurity
              </h1>
              <p className="mt-2 text-xl font-medium text-slate-700 md:text-2xl">Los Angeles City College</p>
              <p className="mt-2 text-sm text-slate-500">855 N. Vermont Avenue, Los Angeles, CA 90029</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center gap-2 font-semibold text-slate-950">
                <RefreshCw className="h-4 w-4" />
                Canvas Sync
              </div>
              <p className="mt-2">
                {syncStatus === "token_expired"
                  ? "Outdated / Sync Paused"
                  : syncStatus === "sync_failed"
                    ? "Sync failed"
                    : lastSyncAt
                  ? `Last synced ${formatShortDate(lastSyncAt)}`
                  : source === "seed"
                    ? "Using starter data until Supabase and Canvas keys are added."
                    : "Waiting for first sync."}
              </p>
              {lastSyncAt ? (
                <p className="mt-1 text-xs text-slate-500">
                  {lastSyncCourses} courses · {lastSyncAssignments} assignments · {lastSyncChanges} changes
                </p>
              ) : null}
              {lastSyncError ? <p className="mt-1 text-xs font-medium text-rose-700">{lastSyncError}</p> : null}
              <Link className="mt-3 inline-flex font-semibold text-teal-800" href="/sync">
                Open Sync Console
              </Link>
            </div>
          </div>

        </div>
      </section>

      {isHomeTab ? (
        <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
          {syncStatus === "token_expired" ? (
            <div className="lg:col-span-2">
              <CanvasTokenAlert lastAttemptAt={lastAttemptAt ? formatShortDate(lastAttemptAt) : null} />
            </div>
          ) : null}
          <div className="grid gap-3 lg:col-span-2 md:grid-cols-4">
            <Metric href="#course-load" icon={<BookOpen />} label="Term courses" value={activeTermCourses.length.toString()} />
            <Metric href="/?focus=due-soon#priority-work" icon={<CalendarDays />} label="Due in 7 days" value={dueSoon.length.toString()} />
            <Metric href="/?focus=at-risk#priority-work" icon={<AlertTriangle />} label="At risk" value={atRiskAssignments.length.toString()} />
            <Metric href="/?focus=missing#priority-work" icon={<ShieldCheck />} label="Missing / mismatch" value={`${missingAssignments.length}/${mismatchAssignments.length}`} />
          </div>
          <HomeOpsOverview
            announcements={announcements}
            canvasCoverage={`${canvasCoverageCount}/${activeTermCourses.length}`}
            dueSoonCount={dueSoon.length}
            highValueCount={highValueCount}
            nextDue={nextDueAssignment?.due_at ? formatShortDate(nextDueAssignment.due_at) : "No live due date"}
            totalAssignments={liveTermAssignments.length}
          />
          <div className="grid gap-6 lg:col-span-2 lg:grid-cols-[1fr_1fr]">
            <TodayFocusPanel
              courses={courses}
              next72HourAssignments={next72HourAssignments}
              nextDueAssignment={nextDueAssignment}
              todayAssignments={todayAssignments}
            />
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-semibold">This Week</h2>
              <p className="mt-2 text-sm text-slate-600">{phase.risk}</p>
              <div className="mt-5 space-y-3">
                <ActionRow icon={<CheckCircle2 />} title="Monday reset" body="Sync Canvas, triage due dates, pick top 3 tasks." />
                <ActionRow icon={<FlaskConical />} title="Lab batch" body="Finish technical labs within 2-3 days of module release." />
                <ActionRow icon={<CalendarDays />} title="Saturday required class" body="CIS 162 online class on Zoom, 14:00-18:00." />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <WeeklySchedule courses={activeTermCourses} />
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center" id="priority-work">
                <div>
                  <h2 className="text-xl font-semibold">{decisionCopy.title}</h2>
                  <p className="text-sm text-slate-600">
                    {decisionCopy.body}
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-md bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">
                  <KanbanSquare className="h-4 w-4" />
                  {phase.name}: {phase.label}
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                {decisionAssignments.length ? (
                  decisionAssignments.map((assignment) => {
                    const course = courses.find((item) => item.id === assignment.course_id);
                    return (
                      <article
                        className="grid gap-4 rounded-lg border border-slate-200 p-4 md:grid-cols-[1fr_auto]"
                        key={assignment.id}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: course?.color ?? "#334155" }}
                            />
                            <p className="text-sm font-semibold text-slate-700">{course?.code}</p>
                            <SourceBadge source={assignment.source} />
                            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                              {assignment.task_type}
                            </span>
                            <span className="rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
                              {assignment.risk_level}
                            </span>
                          </div>
                          <h3 className="mt-2 text-lg font-semibold">{assignment.title}</h3>
                          <p className="mt-1 text-sm text-slate-600">{assignment.notes}</p>
                          <AssignmentStatusActions
                            actions={statusActionsFor(assignment.status)}
                            assignmentId={assignment.id}
                            currentStatus={assignment.status}
                          />
                          {assignment.url ? (
                            <Link
                              className="mt-3 inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
                              href={assignment.url}
                              target="_blank"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Canvas
                            </Link>
                          ) : null}
                        </div>
                        <div className="flex min-w-40 flex-col justify-between gap-3 text-sm md:text-right">
                          <div>
                            <p className="font-semibold">{formatShortDate(assignment.due_at)}</p>
                            <p className="text-slate-500">
                              {assignment.estimated_minutes} min · {assignment.progress_percent}% done
                            </p>
                          </div>
                          <span className="rounded-md bg-slate-950 px-3 py-2 text-center font-semibold text-white">
                            {assignment.priority_score}/100
                          </span>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <EmptyState
                    title="No pending Canvas work"
                    body={
                      lastSyncAt
                        ? "The live Canvas queue is empty after the latest sync. Local seed and case study data are excluded from this decision list."
                        : "Run the first Canvas sync to replace local seed placeholders with live coursework."
                    }
                    href="/sync"
                    action="Open Sync Console"
                  />
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5" id="course-load">
              <h2 className="text-xl font-semibold">{selectedTerm.label} Course Load</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {activeTermCourses.map((course) => (
                  <CourseDetailCard
                    assignments={courseAssignments.filter((assignment) => assignment.course_id === course.id)}
                    course={course}
                    key={course.id}
                  />
                ))}
              </div>
            </div>
        </div>

        <aside className="space-y-6">
          <SubmitProofChecklist assignment={nextDueAssignment} course={proofCourse} />

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">Kanban Snapshot</h2>
            <p className="mt-1 text-sm text-slate-600">
              A quick pipeline view of where each live Canvas assignment stands before it is submitted and graded.
            </p>
            {liveAssignments.length ? (
              <div className="mt-5 space-y-3">
                {Object.entries(statusLabels).map(([status, label]) => {
                  const count = liveAssignments.filter((assignment) => assignment.status === status).length;
                  return (
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2" key={status}>
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                      <span className="text-lg font-semibold">{count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-5 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                No live Canvas assignments are available for the selected term.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">Lab Notes</h2>
            <p className="mt-2 text-sm text-slate-600">
              Starter API is ready for notes. First target: commands, screenshots checklist, hashes, and submission proof.
            </p>
            <div className="mt-5 rounded-lg bg-slate-950 p-4 font-mono text-sm text-slate-100">
              <p>labs tracked: {labCount}</p>
              <p>default fields: command, result, blocker, next step</p>
            </div>
          </div>
        </aside>
      </section>
      ) : (
        <SemesterOverviewView assignments={courseAssignments} courses={selectedTermCourses} term={selectedTerm} />
      )}
    </main>
  );
}

function TermSwitcher({ selectedTabId, selectedTerm }: { selectedTabId: string; selectedTerm: TermConfig }) {
  const isHomeSelected = selectedTabId === "home";

  return (
    <nav aria-label="Academic terms" className="overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-xl border border-slate-200/80 bg-slate-100 p-1.5">
        <Link
          aria-current={isHomeSelected ? "page" : undefined}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
            isHomeSelected
              ? "bg-slate-900 font-semibold text-white shadow-sm"
              : "font-medium text-slate-600 hover:bg-white/60 hover:text-slate-900"
          }`}
          href="/"
        >
          <HomeIcon className={`h-4 w-4 ${isHomeSelected ? "text-white" : "text-slate-500"}`} />
          <span>Home</span>
        </Link>
        {termConfigs.map((term) => {
          const isSelected = term.id === selectedTerm.id && selectedTabId !== "home";
          const tabBadge = termTabBadges[term.id];
          return (
            <Link
              aria-current={isSelected ? "page" : undefined}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                isSelected
                  ? "bg-slate-900 font-semibold text-white shadow-sm"
                  : "font-medium text-slate-600 hover:bg-white/60 hover:text-slate-900"
              }`}
              href={`/?term=${term.id}`}
              key={term.id}
            >
              <span>{term.label}</span>
              {tabBadge ? (
                <span
                  aria-label={tabBadge.label}
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                    isSelected ? "bg-amber-300 text-slate-950" : "bg-amber-100 text-amber-700"
                  }`}
                  title={tabBadge.label}
                >
                  <Award className="h-3.5 w-3.5" />
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function SemesterOverviewView({ assignments, courses, term }: { assignments: Assignment[]; courses: Course[]; term: TermConfig }) {
  const termDates = termDateRanges[term.label] ?? { startsOn: courses[0]?.starts_on, endsOn: courses[0]?.ends_on };

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {term.label} ({formatTermDate(termDates.startsOn)} to {formatTermDate(termDates.endsOn)})
            </h2>
            <p className="text-sm text-slate-600">Courses and schedule for this semester only.</p>
          </div>
          <span className="rounded bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
            {courses.length} records
          </span>
        </div>

        {courses.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseDetailCard
                assignments={assignments.filter((assignment) => assignment.course_id === course.id)}
                course={course}
                key={course.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No courses for this term yet"
            body="Course registration and syllabus sync will appear here once this semester is ready."
            href="/"
            action="Return to Active Term"
          />
        )}
      </div>

      <WeeklySchedule courses={courses} />
    </section>
  );
}

const termDateRanges: Record<string, { startsOn: string; endsOn: string }> = {
  "Spring 2026": { startsOn: "2026-02-09", endsOn: "2026-06-08" },
  "Summer 2026": { startsOn: "2026-06-15", endsOn: "2026-08-09" },
  "Fall 2026": { startsOn: "2026-08-31", endsOn: "2026-12-20" },
  "Winter 2027": { startsOn: "2027-01-04", endsOn: "2027-02-06" },
  "Spring 2027": { startsOn: "2027-02-09", endsOn: "2027-06-08" },
};

function formatTermDate(value: string | undefined) {
  if (!value) return "Date TBA";
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

type CourseLookup = Pick<Course, "id" | "code" | "color">[];

function TodayFocusPanel({
  courses,
  next72HourAssignments,
  nextDueAssignment,
  todayAssignments,
}: {
  courses: CourseLookup;
  next72HourAssignments: Assignment[];
  nextDueAssignment: Assignment | undefined;
  todayAssignments: Assignment[];
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
        <Clock className="h-4 w-4" />
        Today / Next 72 Hours
      </div>
      <h2 className="mt-2 text-xl font-semibold">Short-range focus</h2>
      <div className="mt-4 space-y-4">
        <FocusGroup assignments={todayAssignments} courses={courses} emptyLabel="No live Canvas work due today." title="Today" />
        <FocusGroup
          assignments={next72HourAssignments}
          courses={courses}
          emptyLabel={
            nextDueAssignment?.due_at
              ? `Nothing due in the next 72 hours. Next live due date: ${formatShortDate(nextDueAssignment.due_at)}.`
              : "No upcoming live Canvas due dates found."
          }
          title="Next 72 hours"
        />
      </div>
    </div>
  );
}

function FocusGroup({
  assignments,
  courses,
  emptyLabel,
  title,
}: {
  assignments: Assignment[];
  courses: CourseLookup;
  emptyLabel: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {assignments.length ? (
        <div className="mt-2 space-y-2">
          {assignments.map((assignment) => {
            const course = courses.find((item) => item.id === assignment.course_id);
            return (
              <div className="rounded-lg bg-slate-50 p-3" key={assignment.id}>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: course?.color ?? "#334155" }} />
                  <span>{course?.code ?? "Course"}</span>
                  <span>{assignment.points_possible ?? 0} pts</span>
                  <span>{assignment.due_at ? formatShortDate(assignment.due_at) : "No due date"}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-950">{assignment.title}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{emptyLabel}</p>
      )}
    </div>
  );
}

function CanvasOutagePlan({
  dueSoonCount,
  highValueCount,
  nextDue,
}: {
  dueSoonCount: number;
  highValueCount: number;
  nextDue: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
        <AlertTriangle className="h-4 w-4" />
        Canvas Outage Plan
      </div>
      <h2 className="mt-2 text-xl font-semibold">Submit before the platform becomes the problem</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <MiniStat icon={<CalendarDays />} label="7-day buffer" value={`${dueSoonCount} tasks`} />
        <MiniStat icon={<AlertTriangle />} label="High value" value={`${highValueCount}`} />
        <MiniStat icon={<Clock />} label="Next due" value={nextDue} />
      </div>
      <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
        Keep screenshots, filenames, and timestamps ready before due dates. If Canvas, Cengage, or NetLab has maintenance,
        submit early and keep proof outside the browser.
      </div>
    </div>
  );
}

function SubmitProofChecklist({ assignment, course }: { assignment: Assignment | undefined; course: Course | undefined }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
        <ShieldCheck className="h-4 w-4" />
        Submit Proof
      </div>
      <h2 className="mt-2 text-xl font-semibold">Before marking submitted</h2>
      {assignment ? (
        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-700">{course?.code ?? "Course"}</p>
          <p className="mt-1 font-semibold text-slate-950">{assignment.title}</p>
          <p className="mt-1 text-sm text-slate-600">{assignment.due_at ? formatShortDate(assignment.due_at) : "No due date"}</p>
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          No live Canvas assignment needs proof right now.
        </p>
      )}
      <div className="mt-4 space-y-2 text-sm text-slate-700">
        {["Submission screenshot saved", "Canvas confirmation page captured", "File name and timestamp recorded", "Backup copy stored locally"].map(
          (item) => (
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2" key={item}>
              <CheckCircle2 className="h-4 w-4 text-teal-700" />
              <span>{item}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function statusActionsFor(status: TaskStatus) {
  const actions: { status: TaskStatus; label: string }[] = [];

  if (status === "DISCOVERED") {
    actions.push({ status: "ACKNOWLEDGED", label: "Acknowledge" });
    actions.push({ status: "STARTED", label: "Start" });
  } else if (status === "ACKNOWLEDGED") {
    actions.push({ status: "STARTED", label: "Start" });
  } else if (status === "STARTED") {
    actions.push({ status: "READY_FOR_AUDIT", label: "Ready for Audit" });
  } else if (status === "READY_FOR_AUDIT") {
    actions.push({ status: "AI_AUDITED", label: "AI Audited" });
    actions.push({ status: "READY_TO_SUBMIT", label: "Ready to Submit" });
  } else if (status === "AI_AUDITED") {
    actions.push({ status: "READY_TO_SUBMIT", label: "Ready to Submit" });
  } else if (status === "READY_TO_SUBMIT") {
    actions.push({ status: "USER_MARKED_SUBMITTED", label: "Mark Submitted" });
  }

  return actions;
}

function HomeOpsOverview({
  announcements,
  canvasCoverage,
  dueSoonCount,
  highValueCount,
  nextDue,
  totalAssignments,
}: {
  announcements: CanvasAnnouncement[];
  canvasCoverage: string;
  dueSoonCount: number;
  highValueCount: number;
  nextDue: string;
  totalAssignments: number;
}) {
  return (
    <div className="grid gap-6 lg:col-span-2 lg:grid-cols-[1.1fr_1fr_0.95fr]">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-amber-800">
              <Megaphone className="h-4 w-4" />
              Canvas Watch
            </div>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Latest announcements and outage planning</h2>
          </div>
          <Link className="text-sm font-semibold text-amber-900" href="/sync">
            Sync
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {announcements.length ? (
            announcements.map((announcement) => (
              <article className="rounded-lg border border-amber-200 bg-white p-3" key={announcement.id}>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="rounded bg-amber-100 px-2 py-1 text-amber-900">{announcement.courseCode}</span>
                  <span>{announcement.postedAt ? formatShortDate(announcement.postedAt) : "No posted date"}</span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-slate-950">{announcement.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-700">{announcement.summary}</p>
                {announcement.url ? (
                  <Link className="mt-2 inline-flex text-sm font-semibold text-teal-800" href={announcement.url} target="_blank">
                    Open in Canvas
                  </Link>
                ) : null}
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-amber-200 bg-white p-3">
              <p className="font-semibold text-slate-950">No current Canvas announcements found.</p>
              <p className="mt-1 text-sm text-slate-700">
                Keep a 24-hour submission buffer for high-point work. If Canvas or LACCD posts maintenance, outages, or
                security incidents, submit early and save proof of submission.
              </p>
            </div>
          )}
        </div>
      </div>

      <CanvasOutagePlan dueSoonCount={dueSoonCount} highValueCount={highValueCount} nextDue={nextDue} />

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          <ShieldCheck className="h-4 w-4" />
          Ops Stats
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MiniStat icon={<BookOpen />} label="Live coverage" value={canvasCoverage} />
          <MiniStat icon={<KanbanSquare />} label="Canvas items" value={totalAssignments.toString()} />
          <MiniStat icon={<Clock />} label="Next due" value={nextDue} />
          <MiniStat icon={<AlertTriangle />} label="100+ point tasks" value={highValueCount.toString()} />
        </div>
      </div>

    </div>
  );
}

function SourceBadge({ source }: { source: SourceKind }) {
  const label =
    source === "canvas"
      ? "Live Canvas"
      : source === "mock"
        ? "Local Seed"
        : source === "user"
          ? "Manual"
          : "AI";

  const color =
    source === "canvas"
      ? "bg-emerald-50 text-emerald-800"
      : source === "mock"
        ? "bg-slate-100 text-slate-700"
        : source === "user"
          ? "bg-sky-50 text-sky-800"
          : "bg-violet-50 text-violet-800";

  return <span className={`rounded px-2 py-1 text-xs font-medium ${color}`}>{label}</span>;
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-600">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-teal-700 [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function EmptyState({ title, body, href, action }: { title: string; body: string; href: string; action: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
      <p className="font-semibold text-slate-950">{title}</p>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
      <Link className="mt-4 inline-flex font-semibold text-teal-800" href={href}>
        {action}
      </Link>
    </div>
  );
}

function Metric({ href, icon, label, value }: { href?: string; icon: React.ReactNode; label: string; value: string }) {
  const content = (
    <>
      <div className="flex items-center gap-2 text-slate-600">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-teal-700 [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </>
  );

  if (href) {
    return (
      <Link className="block rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-teal-300 hover:bg-white" href={href}>
        {content}
      </Link>
    );
  }

  return <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">{content}</div>;
}

function ActionRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3 rounded-lg bg-slate-50 p-3">
      <span className="mt-0.5 text-teal-700 [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-slate-600">{body}</p>
      </div>
    </div>
  );
}
