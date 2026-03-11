"use client";

import { useState } from "react";
import type { Booking, Child } from "@/data/parent";

interface BookingsTableProps {
  bookings: Booking[];
  children: Child[];
  onCancel: (bookingId: string) => void;
}

export default function BookingsTable({ bookings, children, onCancel }: BookingsTableProps) {
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const childMap = Object.fromEntries(children.map((c) => [c.id, c]));

  // Sort: upcoming (confirmed, future) first, then by date desc
  const sorted = [...bookings].sort((a, b) => {
    if (a.status !== b.status) return a.status === "confirmed" ? -1 : 1;
    return b.date.localeCompare(a.date);
  });

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-black text-white">נרשמים</h2>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
          {bookings.filter((b) => b.status === "confirmed").length} הרשמות פעילות ·{" "}
          {bookings.filter((b) => b.status === "completed").length} הושלמו
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["שם הילד", "שנתון", "אימון", "תאריך", "שעה", "סטטוס", "פעולות"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-right text-xs font-bold whitespace-nowrap"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
                    אין הרשמות במערכת
                  </td>
                </tr>
              ) : (
                sorted.map((booking, idx) => {
                  const child = childMap[booking.childId];
                  const isConfirmed = booking.status === "confirmed";
                  return (
                    <tr
                      key={booking.id}
                      style={{
                        background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        opacity: isConfirmed ? 1 : 0.55,
                      }}
                    >
                      {/* Child name */}
                      <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                        {child?.name ?? <span style={{ color: "rgba(255,255,255,0.3)" }}>לא ידוע</span>}
                      </td>
                      {/* Birth year */}
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {child?.birthYear ?? "—"}
                      </td>
                      {/* Session title */}
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(255,255,255,0.7)" }}>
                        {booking.title}
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: "#c9a84c" }}>
                        {booking.dayLabel}
                      </td>
                      {/* Time */}
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {booking.time}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
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
                      </td>
                      {/* Cancel action */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isConfirmed && (
                          cancelConfirmId === booking.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => { onCancel(booking.id); setCancelConfirmId(null); }}
                                className="text-xs font-bold px-2 py-1.5 rounded-lg"
                                style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}
                              >
                                אישור
                              </button>
                              <button
                                onClick={() => setCancelConfirmId(null)}
                                className="text-xs font-bold px-2 py-1.5 rounded-lg"
                                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}
                              >
                                לא
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setCancelConfirmId(booking.id)}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                              style={{
                                background: "rgba(239,68,68,0.08)",
                                color: "rgba(252,165,165,0.6)",
                                border: "1px solid rgba(239,68,68,0.15)",
                              }}
                            >
                              ביטול הרשמה
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
