import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProfessorIntelView } from "@/components/ProfessorIntelView";

export const metadata = {
  title: "Professor Intel & Course Registration | Student Star",
  description: "LACC Professor Ratings, Difficulty Scores, and Grade A Strategies for STEM and High-Impact Courses.",
};

export default function ProfessorsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f3] text-slate-950 pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-teal-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Student Star</span>
            <span>·</span>
            <span>Academic Command Center</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <ProfessorIntelView />
      </div>
    </main>
  );
}
