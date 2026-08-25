import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { courseOutcome, sourceBadgeClass, sourceLabels } from "@/lib/course-meta";
import type { Assignment, Course } from "@/lib/semester";

type CourseDetailCardProps = {
  assignments: Assignment[];
  course: Course;
  variant: "active" | "case_study" | "archived";
};

export function CourseDetailCard({ assignments, course, variant }: CourseDetailCardProps) {
  const isCaseStudy = variant !== "active" || course.course_status === "case_study";

  return (
    <Link
      className="group block w-full rounded-lg border border-slate-200 p-4 text-left transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      href={`/courses/${course.id}`}
      prefetch
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold" style={{ color: course.color }}>
            {course.code}
          </p>
          <h3 className={variant === "active" ? "mt-1 text-lg font-semibold" : "mt-1 font-semibold"}>{course.title}</h3>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <SourceBadge source={course.source} />
        <span className="text-sm text-slate-600">{course.term_label}</span>
        <span
          className={`rounded px-2 py-1 text-sm font-medium ${
            course.final_grade ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700"
          }`}
        >
          {course.final_grade ?? (isCaseStudy ? "Case Study" : "Active")}
        </span>
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
            {course.starts_on} to {course.ends_on} · {assignments.length} assignments · {courseOutcome(course)}
          </p>
        </>
      ) : null}
    </Link>
  );
}

function SourceBadge({ source }: { source: Course["source"] }) {
  return <span className={`rounded px-2 py-1 text-xs font-medium ${sourceBadgeClass(source)}`}>{sourceLabels[source]}</span>;
}
