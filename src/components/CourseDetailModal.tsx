import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { compactCourseTitleFor, courseOutcome } from "@/lib/course-meta";
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
      className="group block w-full rounded-lg border border-slate-200 p-3 text-left transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      href={`/courses/${course.id}`}
      prefetch
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold" style={{ color: course.color }}>
            {course.code}
          </p>
          <h3 className="mt-1 text-base font-semibold leading-snug">{compactCourseTitleFor(course)}</h3>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700" />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-sm text-slate-600">{course.term_label}</span>
        <span
          className={`rounded px-1.5 py-0.5 text-xs font-medium ${
            course.final_grade ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700"
          }`}
        >
          {course.final_grade ?? (isCaseStudy ? "Case Study" : "Active")}
        </span>
      </div>
      {variant === "active" ? (
        <>
          <p className="mt-2 text-sm text-slate-600">{course.modality}</p>
          <div className="mt-3 h-1.5 rounded-full bg-slate-100">
            <div
              className="h-1.5 rounded-full"
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
