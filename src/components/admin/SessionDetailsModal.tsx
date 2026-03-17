"use client";

import { useState } from "react";
import type { TrainingSession } from "@/data/schedule";
import type { Booking, Child } from "@/data/parent";
import { formatISODate } from "@/lib/scheduleUtils";

interface SessionDetailsModalProps {
  session: TrainingSession;
  bookings: Booking[];
  children: Child[];
  onClose: () => void;
  onCancelBooking: (bookingId: string) => void;
}

const AGE_COLORS: Record<string, { bg: string; color: string }> = {
  U9:  { bg: "rgba(96,165,250,0.12)",  color: "#93c5fd" },
  U12: { bg: "rgba(167,139,250,0.12)", color: "#c4b5fd" },
  U15: { bg: "rgba(251,146,60,0.12)",  color: "#fdba74" },
  U17: { bg: "rgba(52,211,153,0.12)",  color: "#6ee7b7" },
};

export default function SessionDetailsModal({
  session,
  bookings,
  children,
  onClose,
  onCancelBooking,
}: SessionDetailsModalProps) {
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const childMap = Object.fromEntries(children.map((c) => [c.id, c]));

  // Unique registered children (each child counted once per session regardless of date)
  const registeredChildIds = [...new Set(
    bookings.filter((b) => b.sessionId === session.id).map((b) => b.childId)
  )];
  const registered = registeredChildIds.length;
  const fillPct = session.spotsTotal > 0 ? registered / session.spotsTotal : 0;

  // All individual bookings for this session, sorted by date desc
  const sessionBookings = bookings
    .filter((b) => b.sessionId === session.id)
    .sort((a, b) => a.id.localeCompare(b.id));

  const statusLabel =
    fillPct >= 1 ? "מלא" : fillPct >= 0.8 ? "כמעט מלא" : "פתוח";
  const statusStyle =
    fillPct >= 1
      ? { bg: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.25)" }
      : fillPct >= 0.8
      ? { bg: "rgba(251,146,60,0.12)", color: "#fdba74", border: "1px solid rgba(251,146,60,0.25)" }
      : { bg: "rgba(34,197,94,0.12)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)" };

  const ageBadge = AGE_COLORS[session.ageGroup] ?? { bg: "rgba(255,255,255,0.08)", color: "#fff" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 py-8 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: ageBadge.bg, color: ageBadge.color }}
                >
                  {session.ageGroup}
                </span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: statusStyle.bg, color: statusStyle.color, border: statusStyle.border }}
                >
                  {statusLabel}
                </span>
              </div>
              <h3 className="text-xl font-black text-white">{session.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-sm font-bold px-3 py-1.5 rounded-lg flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
            >
              סגור
            </button>
          </div>
        </div>

        {/* Session details grid */}
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "תאריך", value: formatISODate(session.date) },
              { label: "שעה", value: session.time },
              { label: "מגרש", value: session.location },
              { label: "מאמן", value: session.coach },
              { label: "שנתון", value: session.birthYear },
              { label: "מכסה", value: `${registered} / ${session.spotsTotal}` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</div>
                <div className="font-bold text-sm text-white">{value}</div>
              </div>
            ))}
          </div>

          {/* Fill bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              <span>תפוסה</span>
              <span>{Math.round(fillPct * 100)}%</span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(fillPct * 100, 100)}%`,
                  background:
                    fillPct >= 1
                      ? "rgba(239,68,68,0.7)"
                      : fillPct >= 0.8
                      ? "linear-gradient(90deg, #c9a84c, #fdba74)"
                      : "linear-gradient(90deg, #c9a84c, #e8c97a)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Registrants list */}
        <div className="px-6 py-5">
          <h4
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            רשימת נרשמים ({sessionBookings.length} הרשמות)
          </h4>

          {sessionBookings.length === 0 ? (
            <div
              className="rounded-xl py-8 text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>אין נרשמים לאימון זה</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessionBookings.map((booking) => {
                const child = childMap[booking.childId];
                const isConfirmed = booking.status === "confirmed";
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      opacity: isConfirmed ? 1 : 0.55,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                        style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c" }}
                      >
                        {child?.name?.[0] ?? "?"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          {child?.name ?? "ילד לא ידוע"}
                        </div>
                        <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                          שנתון {child?.birthYear ?? "—"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={
                          isConfirmed
                            ? { background: "rgba(34,197,94,0.12)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)" }
                            : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }
                        }
                      >
                        {isConfirmed ? "מאושר" : "הושלם"}
                      </span>
                      {confirmRemoveId === booking.id ? (
                        <>
                          <button
                            onClick={() => { onCancelBooking(booking.id); setConfirmRemoveId(null); }}
                            className="text-xs font-bold px-2 py-1 rounded-lg"
                            style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}
                          >
                            אישור
                          </button>
                          <button
                            onClick={() => setConfirmRemoveId(null)}
                            className="text-xs font-bold px-2 py-1 rounded-lg"
                            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}
                          >
                            ביטול
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmRemoveId(booking.id)}
                          className="text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ background: "rgba(239,68,68,0.08)", color: "rgba(252,165,165,0.6)", border: "1px solid rgba(239,68,68,0.15)" }}
                        >
                          הסר
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
