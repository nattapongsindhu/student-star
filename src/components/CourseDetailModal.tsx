import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { courseOutcome, displayCourseTitleFor, instructorFor } from "@/lib/course-meta";
import type { Assignment, Course } from "@/lib/semester";

type CourseDetailCardProps = {
  assignments: Assignment[];
  course: Course;
};

export function CourseDetailCard({ assignments, course }: CourseDetailCardProps) {
  const outcome = courseOutcome(course);

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
          <h3 className="mt-1 text-base font-semibold leading-snug">{displayCourseTitleFor(course)}</h3>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700" />
      </div>
      <p className="mt-2 text-sm text-slate-600">{instructorFor(course)}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">
        {assignments.length} assignments ·
        <span
          className={`ml-1 inline-flex rounded px-1.5 py-0.5 align-middle text-xs font-semibold ${
            outcome !== "In progress" ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700"
          }`}
        >
          {outcome}
        </span>
      </p>
    </Link>
  );
}
