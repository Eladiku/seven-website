import Link from "next/link";
import type { Program } from "@/data/programs";

interface ProgramCardProps {
  program: Program;
}

const ageColors: Record<string, string> = {
  U9: "border-blue-400 bg-blue-50",
  U12: "border-purple-400 bg-purple-50",
  U15: "border-orange-400 bg-orange-50",
  U17: "border-green bg-green-100",
};

const ageBadgeColors: Record<string, string> = {
  U9: "bg-blue-100 text-blue-700",
  U12: "bg-purple-100 text-purple-700",
  U15: "bg-orange-100 text-orange-700",
  U17: "bg-green-100 text-green-700",
};

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border-t-4 shadow-sm hover:shadow-lg transition-all overflow-hidden ${ageColors[program.ageGroup] ?? "border-gray-300 bg-white"}`}
    >
      <div className="p-8">
        <div className="flex items-start justify-between mb-5">
          <div>
            <span
              className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${ageBadgeColors[program.ageGroup] ?? "bg-gray-100 text-gray-600"}`}
            >
              {program.ageGroup}
            </span>
            <h3 className="text-xl font-black text-navy">{program.title}</h3>
            <p className="text-sm text-muted mt-0.5">{program.ageRange}</p>
          </div>
          <div className="text-right text-sm text-muted">
            <div className="font-bold text-navy text-lg">{program.sessionsPerWeek}×</div>
            <div>בשבוע</div>
          </div>
        </div>

        <p className="text-muted text-sm leading-relaxed mb-6">
          {program.description}
        </p>

        <ul className="space-y-2 mb-7">
          {program.highlights.map((h) => (
            <li key={h} className="flex items-center gap-2 text-sm">
              <span className="text-green font-bold text-xs">✓</span>
              <span className="text-navy">{h}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          <span className="text-sm text-muted">
            {program.sessionDuration} לאימון
          </span>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-navy text-white text-sm font-bold rounded-xl hover:bg-green hover:text-navy transition-colors"
          >
            להרשמה
          </Link>
        </div>
      </div>
    </div>
  );
}
