import type { Booking } from "@/data/parent";
import type { TrainingSession } from "@/data/schedule";
import { formatISODate } from "@/lib/scheduleUtils";

interface UpcomingSessionsSectionProps {
  bookings: Booking[];
  sessionMap: Record<string, TrainingSession>;
  onCancel: (id: string) => void;
}

export default function UpcomingSessionsSection({
  bookings,
  sessionMap,
  onCancel,
}: UpcomingSessionsSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-black text-white mb-4">אימונים קרובים</h2>

      {bookings.length === 0 ? (
        <div
          className="rounded-2xl py-10 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="text-3xl mb-2">⚽</div>
          <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
            אין אימונים קרובים מאושרים
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const s = sessionMap[booking.sessionId];
            return (
              <div
                key={booking.id}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold mb-1" style={{ color: "#c9a84c" }}>
                      {formatISODate(s?.date)}
                    </div>
                    <div
                      className="font-black text-2xl leading-none mb-2"
                      style={{ color: "rgba(255,255,255,0.9)", fontVariantNumeric: "tabular-nums" }}
                    >
                      {s?.time ?? "—"}
                    </div>
                    <div className="text-white font-bold text-sm mb-0.5">{s?.title ?? "—"}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                      📍 {s?.location ?? "—"}&nbsp;&nbsp;·&nbsp;&nbsp;{s?.coach ?? "—"}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{
                        background: "rgba(34,197,94,0.12)",
                        color: "#86efac",
                        border: "1px solid rgba(34,197,94,0.2)",
                      }}
                    >
                      מאושר ✓
                    </span>
                    <button
                      onClick={() => onCancel(booking.id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        color: "rgba(252,165,165,0.7)",
                        border: "1px solid rgba(239,68,68,0.15)",
                      }}
                    >
                      ביטול הגעה
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
