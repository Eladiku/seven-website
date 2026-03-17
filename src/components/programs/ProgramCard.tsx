import Link from "next/link";
import type { ProgramCardContent } from "@/data/siteContent";

interface ProgramCardProps {
  program: ProgramCardContent;
}

// Top accent color per age group
const ageAccent: Record<string, string> = {
  U9: "#60a5fa",   // blue-400
  U12: "#a78bfa",  // violet-400
  U15: "#fb923c",  // orange-400
  U17: "#6366f1",  // indigo
};

const ageBadgeStyle: Record<string, { background: string; color: string }> = {
  U9:  { background: "rgba(96,165,250,0.12)",  color: "#93c5fd" },
  U12: { background: "rgba(167,139,250,0.12)", color: "#c4b5fd" },
  U15: { background: "rgba(251,146,60,0.12)",  color: "#fdba74" },
  U17: { background: "rgba(99,102,241,0.12)",  color: "#818cf8" },
};

export default function ProgramCard({ program }: ProgramCardProps) {
  const accent = ageAccent[program.ageGroup] ?? "#6366f1";
  const badge = ageBadgeStyle[program.ageGroup] ?? { background: "rgba(255,255,255,0.08)", color: "#9ca3af" };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all hover:translate-y-[-2px]"
      style={{
        background: "#0e1520",
        border: "1px solid rgba(255,255,255,0.07)",
        borderTop: `3px solid ${accent}`,
      }}
    >
      <div className="p-7">
        <div className="flex items-start justify-between mb-5">
          <div>
            <span
              className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3"
              style={badge}
            >
              {program.ageGroup}
            </span>
            <h3 className="text-xl font-black text-white">{program.title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{program.ageRange}</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div className="font-black text-white text-xl">{program.sessionsPerWeek}×</div>
            <div className="text-xs">בשבוע</div>
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          {program.description}
        </p>

        <ul className="space-y-2 mb-7">
          {program.highlights.map((h) => (
            <li key={h} className="flex items-center gap-2 text-sm">
              <span className="text-green font-bold text-xs">✓</span>
              <span className="text-gray-300">{h}</span>
            </li>
          ))}
        </ul>

        <div
          className="flex items-center justify-between pt-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span className="text-sm text-gray-500">
            {program.sessionDuration} לאימון
          </span>
          <Link
            href="/#contact"
            className="px-5 py-2.5 text-white text-sm font-bold rounded-xl transition-all hover:opacity-80"
            style={{ background: "#6366f1" }}
          >
            {program.ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}
