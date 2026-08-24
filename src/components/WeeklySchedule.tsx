import { CalendarDays, Clock, MapPin } from "lucide-react";
import { schoolTimeZone } from "@/lib/semester";
import type { Course } from "@/lib/semester";

type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

type ScheduleBlock = {
  courseCode: string;
  day: WeekdayKey;
  location: string;
  time: string;
  title: string;
};

const weekdayColumns: { key: WeekdayKey; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

const fixedBlocks: ScheduleBlock[] = [
  {
    courseCode: "CIS 112",
    day: "thu",
    location: "City-FH 201",
    time: "2:30-5:40 PM",
    title: "Operating Systems Lab",
  },
  {
    courseCode: "CIS 162",
    day: "sat",
    location: "Zoom 850 1892 7897",
    time: "2:00-6:10 PM",
    title: "Cyber Security I Live Zoom",
  },
];

const fixedCourseCodes = new Set(fixedBlocks.map((block) => block.courseCode));

function getTodayKey() {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: schoolTimeZone,
    weekday: "short",
  })
    .format(new Date())
    .toLowerCase();

  return weekday.slice(0, 3) as WeekdayKey;
}

function isPureOnlineCourse(course: Course) {
  const text = `${course.campus} ${course.modality}`.toLowerCase();
  return text.includes("online") && !text.includes("fh 201") && !text.includes("thu lab") && !fixedCourseCodes.has(course.code);
}

export function WeeklySchedule({ courses }: { courses: Course[] }) {
  const todayKey = getTodayKey();
  const asynchronousCourses = courses.filter(isPureOnlineCourse);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Weekly Class Schedule</h2>
          <p className="mt-2 text-sm text-slate-600">Los Angeles time, with fixed meetings separated from self-paced work.</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-teal-700">
          <CalendarDays className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">
        {weekdayColumns.map((day) => {
          const blocks = fixedBlocks.filter((block) => block.day === day.key);
          const isToday = day.key === todayKey;

          return (
            <section
              className={`min-h-28 rounded-lg border p-3 ${
                isToday ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-slate-50"
              }`}
              key={day.key}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">{day.label}</h3>
                {isToday ? <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-teal-800">Today</span> : null}
              </div>

              <div className="mt-3 space-y-2">
                {blocks.length ? (
                  blocks.map((block) => (
                    <article className="rounded-md bg-white p-3 shadow-sm" key={`${block.courseCode}-${block.day}`}>
                      <p className="text-sm font-semibold text-slate-950">{block.courseCode}</p>
                      <p className="mt-1 text-xs text-slate-600">{block.title}</p>
                      <div className="mt-2 space-y-1 text-xs font-medium text-slate-700">
                        <p className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {day.label} {block.time}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {block.location}
                        </p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No fixed class block</p>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-950">Asynchronous / Self-Paced</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {asynchronousCourses.length ? (
            asynchronousCourses.map((course) => (
              <span
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                key={course.id}
              >
                {course.code}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-600">No self-paced online courses found for this term.</p>
          )}
        </div>
      </div>
    </div>
  );
}
