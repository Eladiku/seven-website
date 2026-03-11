import type { TrainingSession } from "@/data/schedule";

interface SessionCardProps {
  session: TrainingSession;
  isAttending: boolean;
  currentSpots: number;
  onToggle: () => void;
  /** True when the child is booked for this session but their birth year no longer matches */
  isMismatch?: boolean;
}

const AGE_BADGE: Record<string, { bg: string; color: string }> = {
  U9:  { bg: "rgba(96,165,250,0.15)",  color: "#93c5fd" },
  U12: { bg: "rgba(167,139,250,0.15)", color: "#c4b5fd" },
  U15: { bg: "rgba(251,146,60,0.15)",  color: "#fdba74" },
  U17: { bg: "rgba(52,211,153,0.15)",  color: "#6ee7b7" },
};

export default function SessionCard({
  session,
  isAttending,
  currentSpots,
  onToggle,
  isMismatch = false,
}: SessionCardProps) {
  const badge = AGE_BADGE[session.ageGroup] ?? { bg: "rgba(255,255,255,0.1)", color: "#fff" };
  const isFull = currentSpots >= session.spotsTotal && !isAttending;
  const spotsRemaining = session.spotsTotal - currentSpots;
  const fillPct = Math.min((currentSpots / session.spotsTotal) * 100, 100);

  return (
    <div
      className="rounded-2xl p-5 transition-all"
      style={{
        background: isMismatch
          ? "rgba(251,146,60,0.05)"
          : isAttending
          ? "rgba(201,168,76,0.07)"
          : "rgba(255,255,255,0.04)",
        border: isMismatch
          ? "1px solid rgba(251,146,60,0.3)"
          : isAttending
          ? "1px solid rgba(201,168,76,0.35)"
          : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Top row: badge + year on right, time on left (RTL: right-start) */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: badge.bg, color: badge.color }}
          >
            {session.ageGroup}
          </span>
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>
            שנתון {session.birthYear}
          </span>
        </div>

        {/* Attending indicator */}
        {isAttending && (
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={
              isMismatch
                ? { background: "rgba(251,146,60,0.15)", color: "#fdba74" }
                : { background: "rgba(201,168,76,0.15)", color: "#c9a84c" }
            }
          >
            נרשמתם לאימון זה ✓
          </span>
        )}
      </div>

      {/* Time — large and prominent */}
      <div
        className="font-black text-3xl leading-none mb-2"
        style={{ color: "#c9a84c", fontVariantNumeric: "tabular-nums" }}
      >
        {session.time}
      </div>

      {/* Session title */}
      <div className="text-white font-bold text-base mb-1">{session.title}</div>

      {/* Location + coach */}
      <div className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
        📍 {session.location}&nbsp;&nbsp;·&nbsp;&nbsp;{session.coach}
      </div>

      {/* Spots bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>
            {isFull && !isAttending
              ? "האימון מלא"
              : `${spotsRemaining > 0 ? spotsRemaining : 0} מקומות פנויים`}
          </span>
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
            {currentSpots}/{session.spotsTotal} משתתפים
          </span>
        </div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 4, background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${fillPct}%`,
              background: isFull && !isAttending
                ? "rgba(255,255,255,0.2)"
                : "linear-gradient(90deg, #c9a84c, #e8c97a)",
            }}
          />
        </div>
      </div>

      {/* Mismatch warning */}
      {isMismatch && (
        <div
          className="mb-3 rounded-xl px-3 py-2 text-xs font-semibold"
          style={{
            background: "rgba(251,146,60,0.08)",
            border: "1px solid rgba(251,146,60,0.2)",
            color: "#fdba74",
          }}
        >
          אינו תואם לשנתון הנוכחי — האימון נשמר כי נרשמת אליו
        </div>
      )}

      {/* CTA */}
      {isFull ? (
        <button
          disabled
          className="w-full py-3 rounded-xl font-bold text-sm cursor-not-allowed"
          style={{
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.25)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          מלא
        </button>
      ) : isAttending ? (
        <button
          onClick={onToggle}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80 active:scale-[0.98]"
          style={{
            background: "rgba(239,68,68,0.1)",
            color: "#fca5a5",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          ביטול הגעה
        </button>
      ) : (
        <button
          onClick={onToggle}
          className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
            color: "#07100e",
            boxShadow: "0 4px 16px rgba(201,168,76,0.25)",
          }}
        >
          אישור הגעה
        </button>
      )}
    </div>
  );
}
