"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Flame,
  GraduationCap,
  Home,
  Info,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import {
  type CourseIntel,
  type ProfessorRecord,
  type RecommendationTier,
  professorIntelCourses,
} from "@/lib/professor-intel";

const tierConfig: Record<
  RecommendationTier,
  { label: string; badgeClass: string; borderClass: string; icon: React.ReactNode }
> = {
  TOP_PICK: {
    label: "Top Pick · Recommended",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    borderClass: "border-l-4 border-l-emerald-500",
    icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
  },
  FAIR_SOLID: {
    label: "Fair & Solid · Reliable",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
    borderClass: "border-l-4 border-l-sky-500",
    icon: <CheckCircle2 className="h-4 w-4 text-sky-600" />,
  },
  STRICT_TOUGH: {
    label: "Strict · Tough Grader",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    borderClass: "border-l-4 border-l-amber-500",
    icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  },
  AVOID: {
    label: "Avoid · High Risk for A",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200 font-bold",
    borderClass: "border-l-4 border-l-rose-600 bg-rose-50/20",
    icon: <XCircle className="h-4 w-4 text-rose-600" />,
  },
};

const warningBadge: Record<
  CourseIntel["difficultyWarning"],
  { label: string; badgeClass: string }
> = {
  CRITICAL: {
    label: "Crucial Core STEM (5 Units)",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
  },
  HIGH: {
    label: "High Impact Course",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
  },
  MODERATE: {
    label: "Prerequisite Course",
    badgeClass: "bg-slate-100 text-slate-800 border-slate-300",
  },
};

export function ProfessorIntelView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [tierFilter, setTierFilter] = useState<string>("ALL");

  const departments = [
    { key: "ALL", label: "All Subjects" },
    { key: "MATH", label: "Mathematics (MATH)" },
    { key: "PHYS", label: "Physics (PHYS)" },
    { key: "CHEM", label: "Chemistry (CHEM)" },
    { key: "ENGL", label: "English (ENGL)" },
    { key: "STAT", label: "Statistics (STAT)" },
  ];

  const filteredCourses = professorIntelCourses.filter((course) => {
    if (selectedDept !== "ALL" && course.department !== selectedDept) {
      return false;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchCode = course.code.toLowerCase().includes(q);
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchProf = course.professors.some(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tipsForSuccess.toLowerCase().includes(q)
      );
      if (!matchCode && !matchTitle && !matchProf) return false;
    }

    if (tierFilter !== "ALL") {
      const hasTier = course.professors.some((p) => p.tier === tierFilter);
      if (!hasTier) return false;
    }

    return true;
  });

  const totalProfsCount = professorIntelCourses.reduce(
    (sum, c) => sum + c.professors.length,
    0
  );
  const topPicksCount = professorIntelCourses.reduce(
    (sum, c) => sum + c.professors.filter((p) => p.tier === "TOP_PICK").length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Mission Alignment */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-800 text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-800">
                Course Registration & Professor Intel
              </p>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Zero Bad Professors → Protect an A in Every Class
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
              ฐานข้อมูลคัดกรองอาจารย์สำหรับวิชา STEM และวิชาบังคับยากที่ Los Angeles City College (LACC) 
              วิเคราะห์จาก RateMyProfessors เพื่อป้องกันการเจออาจารย์ตรวจงานช้า กดเกรด สอนไม่รู้เรื่อง หรือทิ้งเด็ก 
              คัดสรรอาจารย์ที่สอนดี มี Extra credit และพร้อมช่วยให้นักศึกษาคว้าเกรด A
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Home className="h-4 w-4" />
              Dashboard Home
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500 uppercase">Target Courses</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{professorIntelCourses.length} วิชา</p>
            <p className="text-xs text-slate-600">Math, Phys, Chem, Engl, Stat</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500 uppercase">Professors Profiled</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalProfsCount} ท่าน</p>
            <p className="text-xs text-slate-600">Verified LACC RMP records</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
            <p className="text-xs font-semibold text-emerald-800 uppercase">Top Recommended</p>
            <p className="mt-1 text-2xl font-bold text-emerald-900">{topPicksCount} ท่าน</p>
            <p className="text-xs text-emerald-700">⭐ 4.0 - 5.0 Rating / High A rate</p>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-3">
            <p className="text-xs font-semibold text-rose-800 uppercase">Flagged / Avoid</p>
            <p className="mt-1 text-2xl font-bold text-rose-900">
              {professorIntelCourses.reduce(
                (sum, c) => sum + c.professors.filter((p) => p.tier === "AVOID").length,
                0
              )}{" "}
              ท่าน
            </p>
            <p className="text-xs text-rose-700">กดเกรด / ตรวจงานช้า / งานล้น</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อวิชา เช่น MATH 260, PHYS 101 หรือชื่ออาจารย์ เช่น Kee Lam, Arvidson..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none ring-teal-700 focus:border-teal-700 focus:ring-1"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none"
          >
            {departments.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </select>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none"
          >
            <option value="ALL">All Tiers (ทุกกลุ่ม)</option>
            <option value="TOP_PICK">⭐ Top Pick Only (อาจารย์ยอดเยี่ยม)</option>
            <option value="FAIR_SOLID">⚖️ Fair & Solid (สอนดี เกรดยุติธรรม)</option>
            <option value="STRICT_TOUGH">⚡ Strict (เข้มงวด/ข้อสอบยาก)</option>
            <option value="AVOID">🚫 Avoid Only (ควรหลีกเลี่ยง)</option>
          </select>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course.code} course={course} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-lg font-semibold text-slate-900">ไม่พบวิชาหรืออาจารย์ที่ค้นหา</h3>
            <p className="mt-1 text-sm text-slate-500">
              ลองปรับเปลี่ยนคำค้นหา หรือเลือกตัวกรองเป็น All Subjects
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: CourseIntel }) {
  const warning = warningBadge[course.difficultyWarning];

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Course Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-teal-800 px-2.5 py-1 text-xs font-bold tracking-wider text-white">
                {course.code}
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {course.units} Units
              </span>
              <span
                className={`rounded border px-2 py-0.5 text-xs font-semibold ${warning.badgeClass}`}
              >
                {warning.label}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">{course.title}</h2>
            <p className="mt-1 text-xs text-slate-500">{course.laccDescription}</p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900 sm:max-w-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div>
                <span className="font-bold">คำเตือนสำหรับเกรด A: </span>
                <span>{course.warningText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professors List */}
      <div className="divide-y divide-slate-100 p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            อาจารย์ที่สอนวิชานี้ที่ LACC ({course.professors.length} ตัวเลือก)
          </p>
          <span className="text-xs text-slate-500">เรียงตามความเหมาะสมในการเก็บเกรด A</span>
        </div>

        <div className="space-y-4 pt-2">
          {course.professors.map((prof) => (
            <ProfessorRow key={prof.name} prof={prof} courseCode={course.code} />
          ))}
        </div>
      </div>
    </article>
  );
}

function ProfessorRow({
  prof,
  courseCode,
}: {
  prof: ProfessorRecord;
  courseCode: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const tier = tierConfig[prof.tier];

  return (
    <div
      className={`rounded-xl border border-slate-200 p-4 transition-all ${tier.borderClass} ${
        prof.tier === "TOP_PICK" ? "bg-emerald-50/15" : "bg-white"
      }`}
    >
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        {/* Basic Info */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold text-slate-950">{prof.name}</h3>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tier.badgeClass}`}
            >
              {tier.icon}
              {tier.label}
            </span>
            <span className="text-xs text-slate-500">{prof.department}</span>
          </div>
          <p className="text-sm font-medium text-slate-700">{prof.summary}</p>
        </div>

        {/* Rating Metrics & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quality Score */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-center">
            <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
            <div>
              <span className="text-base font-bold text-slate-900">
                {prof.overallRating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">/5</span>
            </div>
            <span className="ml-1 text-[11px] text-slate-500">Quality</span>
          </div>

          {/* Difficulty Score */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-center">
            <Flame
              className={`h-4 w-4 ${
                prof.difficulty >= 3.5
                  ? "text-rose-500 fill-rose-400"
                  : prof.difficulty >= 2.5
                  ? "text-amber-500"
                  : "text-emerald-500"
              }`}
            />
            <div>
              <span className="text-base font-bold text-slate-900">
                {prof.difficulty.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">/5</span>
            </div>
            <span className="ml-1 text-[11px] text-slate-500">Difficulty</span>
          </div>

          {/* Would Take Again */}
          {prof.wouldTakeAgainPercent !== null ? (
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-center">
              <ThumbsUp className="h-4 w-4 text-teal-600" />
              <span className="text-base font-bold text-slate-900">
                {prof.wouldTakeAgainPercent}%
              </span>
              <span className="text-[11px] text-slate-500">Take Again</span>
            </div>
          ) : null}

          {/* RMP External Link */}
          <Link
            href={prof.rmpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-teal-800"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            RMP Profile ({prof.reviewCount})
          </Link>

          {/* Expand Details Toggle */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            {expanded ? "ซ่อนรายละเอียด ▲" : "ดูเคล็ดลับ A & รีวิว ▼"}
          </button>
        </div>
      </div>

      {/* Expanded Details Section */}
      {expanded ? (
        <div className="mt-4 border-t border-slate-200/80 pt-4 text-sm text-slate-700">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Pros */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                จุดเด่น & ข้อดี (ข้อได้เปรียบ)
              </p>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-800">
                {prof.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons & Red Flags */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                ข้อควรระวัง & สิ่งที่ต้องเตรียมใจ
              </p>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-800">
                {prof.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>

              {prof.redFlags && prof.redFlags.length > 0 ? (
                <div className="mt-3 border-t border-rose-200 pt-2 text-xs">
                  <span className="font-bold text-rose-800">🚨 Red Flags: </span>
                  <span className="text-rose-700">
                    {prof.redFlags.join(" · ")}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Tips for Success and Teaching Style */}
          <div className="mt-3 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5 md:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                🎯 เคล็ดลับทำเกรด A ในวิชา {courseCode} กับ {prof.name}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-800">
                {prof.tipsForSuccess}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
                สไตล์การสอน & นโยบายคลาส
              </p>
              <p className="mt-1 text-xs text-slate-700">{prof.teachingStyle}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
