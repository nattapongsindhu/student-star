import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FlaskConical,
  HomeIcon,
  KanbanSquare,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { CanvasTokenAlert } from "@/components/CanvasTokenAlert";
import { WeeklySchedule } from "@/components/WeeklySchedule";
import { getDashboardData } from "@/lib/dashboard-data";
import {
  daysUntil,
  formatShortDate,
  getActiveTermConfig,
  getPhase,
  termConfigs,
} from "@/lib/semester";
import type { Course, TermConfig, TermStatus } from "@/lib/semester";
import { isCanvasComplete } from "@/lib/status";
import { statusLabels } from "@/lib/status";
import { SourceKind } from "@/types/academic";

const courseStatusLabels = {
  upcoming: "Upcoming",
  active: "Active",
  completed: "Completed",
  case_study: "Case Study",
} as const;

type HomeProps = {
  searchParams?: Promise<{
    term?: string;
  }>;
};

const termStatusLabels: Record<TermStatus, string> = {
  active: "Active",
  archived: "Archive",
  upcoming: "Upcoming",
};

export default async function Home({ searchParams }: HomeProps) {
  const params = searchParams ? await searchParams : {};
  const { courses, assignments, lastSyncAt, lastAttemptAt, syncStatus, source } = await getDashboardData();
  const activeTerm = getActiveTermConfig();
  const requestedTermId = params.term;
  const selectedTermId = requestedTermId && termConfigs.some((term) => term.id === requestedTermId) ? requestedTermId : "home";
  const selectedTerm = termConfigs.find((term) => term.id === selectedTermId) ?? activeTerm;
  const phase = getPhase();
  const fallCourses = courses.filter((course) => course.term_label === "Fall 2026");
  const caseStudyCourses = courses.filter((course) => course.course_status === "case_study");
  const fallCourseIds = new Set(fallCourses.map((course) => course.id));
  const currentAssignments = assignments.filter((assignment) => fallCourseIds.has(assignment.course_id));
  const liveAssignments = currentAssignments.filter((assignment) => assignment.source === "canvas");
  const activeAssignments = liveAssignments
    .slice()
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, 6);
  const dueSoon = liveAssignments.filter((assignment) => {
    const days = daysUntil(assignment.due_at);
    return days !== null && days <= 7 && !isCanvasComplete(assignment.status);
  });
  const labCount = liveAssignments.filter((assignment) => assignment.task_type === "lab").length;
  const mismatchCount = liveAssignments.filter(
    (assignment) => assignment.status === "USER_MARKED_SUBMITTED" && !assignment.canvas_submission_confirmed,
  ).length;
  const missingCount = liveAssignments.filter((assignment) => {
    const days = daysUntil(assignment.due_at);
    return days !== null && days < 0 && !assignment.canvas_submission_confirmed;
  }).length;
  const atRiskCount = liveAssignments.filter(
    (assignment) => assignment.risk_level === "HIGH" || assignment.risk_level === "CRITICAL",
  ).length;
  const archivedTermCourses = caseStudyCourses.filter((course) => course.term_label === selectedTerm.label);
  const upcomingTermCourses = courses.filter((course) => course.term_label === selectedTerm.label);

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
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal text-slate-950 md:text-6xl">
                {selectedTerm.status === "active"
                  ? "What should I do now to protect an A in every class?"
                  : selectedTerm.status === "archived"
                    ? "What patterns helped me finish this term well?"
                    : "What should I prepare before this term opens?"}
              </h1>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center gap-2 font-semibold text-slate-950">
                <RefreshCw className="h-4 w-4" />
                Canvas Sync
              </div>
              <p className="mt-2">
                {syncStatus === "token_expired"
                  ? "Outdated / Sync Paused"
                  : lastSyncAt
                  ? `Last synced ${formatShortDate(lastSyncAt)}`
                  : source === "seed"
                    ? "Using starter data until Supabase and Canvas keys are added."
                    : "Waiting for first sync."}
              </p>
              <Link className="mt-3 inline-flex font-semibold text-teal-800" href="/sync">
                Open Sync Console
              </Link>
            </div>
          </div>

          {selectedTerm.status === "active" ? (
            <div className="grid gap-3 md:grid-cols-4">
              <Metric icon={<BookOpen />} label="Fall courses" value={fallCourses.length.toString()} />
              <Metric icon={<CalendarDays />} label="Due in 7 days" value={dueSoon.length.toString()} />
              <Metric icon={<AlertTriangle />} label="At risk" value={atRiskCount.toString()} />
              <Metric icon={<ShieldCheck />} label="Missing / mismatch" value={`${missingCount}/${mismatchCount}`} />
            </div>
          ) : null}
        </div>
      </section>

      {selectedTerm.status === "active" ? (
        <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
          {syncStatus === "token_expired" ? (
            <div className="lg:col-span-2">
              <CanvasTokenAlert lastAttemptAt={lastAttemptAt ? formatShortDate(lastAttemptAt) : null} />
            </div>
          ) : null}
          <div className="grid gap-6 lg:col-span-2 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-semibold">This Week</h2>
              <p className="mt-2 text-sm text-slate-600">{phase.risk}</p>
              <div className="mt-5 space-y-3">
                <ActionRow icon={<CheckCircle2 />} title="Monday reset" body="Sync Canvas, triage due dates, pick top 3 tasks." />
                <ActionRow icon={<FlaskConical />} title="Lab batch" body="Finish technical labs within 2-3 days of module release." />
                <ActionRow icon={<CalendarDays />} title="Thursday fixed block" body="CIS 112 lab at City-FH 201, 2:30-5:40 PM." />
              </div>
            </div>

            <WeeklySchedule courses={fallCourses} />
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-semibold">What Should I Do Now?</h2>
                  <p className="text-sm text-slate-600">
                    Sorted by deadline pressure, points, progress, workload, and Canvas submission state.
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-md bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">
                  <KanbanSquare className="h-4 w-4" />
                  {phase.name}: {phase.label}
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                {activeAssignments.length ? (
                  activeAssignments.map((assignment) => {
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

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-semibold">Fall Course Load</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {fallCourses.map((course) => (
                  <article className="rounded-lg border border-slate-200 p-4" key={course.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold" style={{ color: course.color }}>
                          {course.code}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold">{course.title}</h3>
                      </div>
                      <span className="rounded bg-slate-100 px-2 py-1 text-sm font-medium">
                        {courseStatusLabels[course.course_status] ?? "Active"}
                      </span>
                    </div>
                    <div className="mt-3">
                      <SourceBadge source={course.source} />
                    </div>
                    {course.final_grade ? (
                      <p className="mt-3 text-sm font-semibold text-emerald-700">Outcome: {course.final_grade}</p>
                    ) : null}
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
                      {(course.term_label ?? "Fall 2026")} · {course.starts_on} to {course.ends_on} · Source:{" "}
                      {course.source}
                    </p>
                  </article>
                ))}
              </div>
            </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Past A Case Studies</h2>
                <p className="text-sm text-slate-600">
                  Completed classes kept out of workload counts and used only for future pattern analysis.
                </p>
              </div>
              <span className="rounded bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                {caseStudyCourses.length} records
              </span>
            </div>
            <div className="mt-5 grid gap-2 md:grid-cols-2">
              {caseStudyCourses.map((course) => (
                <article className="rounded-lg border border-slate-200 p-4" key={course.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold" style={{ color: course.color }}>
                        {course.code}
                      </p>
                      <h3 className="mt-1 font-semibold">{course.title}</h3>
                    </div>
                    <span className="rounded bg-slate-100 px-2 py-1 text-sm font-medium">
                      {course.final_grade ?? "Case Study"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <SourceBadge source={course.source} />
                    <p className="text-sm text-slate-600">{course.term_label}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">Kanban Snapshot</h2>
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
                No live Canvas assignments are available for the current Fall courses.
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
      ) : selectedTerm.status === "archived" ? (
        <ArchivedTermView courses={archivedTermCourses} term={selectedTerm} />
      ) : (
        <UpcomingTermView courses={upcomingTermCourses} term={selectedTerm} />
      )}
    </main>
  );
}

function TermSwitcher({ selectedTabId, selectedTerm }: { selectedTabId: string; selectedTerm: TermConfig }) {
  const isHomeSelected = selectedTabId === "home";

  return (
    <nav aria-label="Academic terms" className="overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
        <Link
          aria-current={isHomeSelected ? "page" : undefined}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
            isHomeSelected ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-950"
          }`}
          href="/"
        >
          <HomeIcon className="h-4 w-4 text-slate-500" />
          <span>Home</span>
        </Link>
        {termConfigs.map((term) => {
          const isSelected = term.id === selectedTerm.id && selectedTabId !== "home";
          return (
            <Link
              aria-current={isSelected ? "page" : undefined}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                isSelected
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-slate-950"
              }`}
              href={`/?term=${term.id}`}
              key={term.id}
            >
              <span>{term.label}</span>
              <TermStatusBadge status={term.status} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function TermStatusBadge({ status }: { status: TermStatus }) {
  const color =
    status === "active"
      ? "bg-emerald-50 text-emerald-800"
      : status === "archived"
        ? "bg-slate-100 text-slate-700"
        : "bg-sky-50 text-sky-800";

  return <span className={`rounded px-2 py-1 text-xs font-medium ${color}`}>{termStatusLabels[status]}</span>;
}

function ArchivedTermView({ courses, term }: { courses: Course[]; term: TermConfig }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold">Archived Term View</h2>
            <p className="text-sm text-slate-600">
              Completed courses from {term.label}. Active execution widgets are hidden for archived terms.
            </p>
          </div>
          <span className="rounded bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
            {courses.length} records
          </span>
        </div>

        {courses.length ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {courses.map((course) => (
              <article className="rounded-lg border border-slate-200 p-4" key={course.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold" style={{ color: course.color }}>
                      {course.code}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">{course.title}</h3>
                  </div>
                  <span className="rounded bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-800">
                    {course.final_grade ?? "Complete"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <SourceBadge source={course.source} />
                  <span className="text-sm text-slate-600">{term.label}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No archived courses for this term"
            body="Case study records will appear here once completed courses are added for this term."
            href="/"
            action="Return to Active Term"
          />
        )}
      </div>
    </section>
  );
}

function UpcomingTermView({ courses, term }: { courses: Course[]; term: TermConfig }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold">Upcoming Term View</h2>
            <p className="text-sm text-slate-600">
              Course registration and syllabus sync will open closer to {term.label}.
            </p>
          </div>
          <span className="rounded bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800">
            {termStatusLabels[term.status]}
          </span>
        </div>

        {courses.length ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {courses.map((course) => (
              <article className="rounded-lg border border-slate-200 p-4" key={course.id}>
                <p className="font-semibold" style={{ color: course.color }}>
                  {course.code}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{course.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{course.modality}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No planned courses yet"
            body="Course registration and syllabus sync will open closer to term start."
            href="/"
            action="Return to Active Term"
          />
        )}
      </div>
    </section>
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

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-600">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-teal-700 [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
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
