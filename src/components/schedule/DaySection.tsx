import type { TrainingSession } from "@/data/schedule";
import { formatHebDate } from "@/lib/scheduleUtils";
import SessionCard from "./SessionCard";

interface DaySectionProps {
  date: Date;
  sessions: TrainingSession[];
  attending: Set<string>;
  /** Session IDs that are booked but don't match the child's current birth year */
  mismatchedIds: Set<string>;
  localSpots: Record<string, number>;
  onToggle: (id: string) => void;
}

export default function DaySection({
  date,
  sessions,
  attending,
  mismatchedIds,
  localSpots,
  onToggle,
}: DaySectionProps) {
  return (
    <div>
      {/* Date heading + divider */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-bold whitespace-nowrap" style={{ color: "#c9a84c" }}>
          {formatHebDate(date)}
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(201,168,76,0.2)" }} />
      </div>

      {sessions.length === 0 ? (
        <div
          className="rounded-2xl py-10 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="text-3xl mb-2">⚽</div>
          <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.2)" }}>
            אין אימונים ביום זה
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isAttending={attending.has(session.id)}
              isMismatch={mismatchedIds.has(session.id)}
              currentSpots={localSpots[session.id] ?? session.spotsFilled}
              onToggle={() => onToggle(session.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
