import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { instructorFor } from "@/lib/course-meta";
import type { Assignment, Course } from "@/lib/semester";

type CourseDetailCardProps = {
  assignments: Assignment[];
  course: Course;
  variant: "active" | "case_study" | "archived";
};

export function CourseDetailCard({ course }: CourseDetailCardProps) {
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
          <h3 className="mt-1 text-base font-semibold leading-snug">{course.title}</h3>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700" />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-sm text-slate-600">{instructorFor(course)}</span>
        <span
          className={`rounded px-1.5 py-0.5 text-xs font-medium ${
            course.final_grade ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700"
          }`}
        >
          {course.final_grade ?? "Pending"}
        </span>
      </div>
    </Link>
  );
}
