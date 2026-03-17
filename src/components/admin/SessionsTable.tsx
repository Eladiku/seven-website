"use client";

import { useState } from "react";
import type { TrainingSession } from "@/data/schedule";
import type { Booking, Child } from "@/data/parent";
import { formatISODate } from "@/lib/scheduleUtils";
import type { Coach, Field } from "@/lib/storage";
import SessionModal from "./SessionModal";
import SessionDetailsModal from "./SessionDetailsModal";

interface SessionsTableProps {
  sessions: TrainingSession[];
  bookings: Booking[];
  children: Child[];
  coaches: Coach[];
  fields: Field[];
  onAdd: (data: Omit<TrainingSession, "id" | "spotsFilled">) => void;
  onEdit: (id: string, data: Omit<TrainingSession, "id" | "spotsFilled">) => void;
  onDelete: (id: string) => void;
  onCancelBooking: (id: string) => void;
}

const AGE_COLORS: Record<string, { bg: string; color: string }> = {
  U9:  { bg: "rgba(96,165,250,0.12)",  color: "#93c5fd" },
  U12: { bg: "rgba(167,139,250,0.12)", color: "#c4b5fd" },
  U15: { bg: "rgba(251,146,60,0.12)",  color: "#fdba74" },
  U17: { bg: "rgba(52,211,153,0.12)",  color: "#6ee7b7" },
};

export default function SessionsTable({
  sessions,
  bookings,
  children,
  coaches,
  fields,
  onAdd,
  onEdit,
  onDelete,
  onCancelBooking,
}: SessionsTableProps) {
  const [modalSession, setModalSession] = useState<TrainingSession | null | "new">(null);
  const [detailsSession, setDetailsSession] = useState<TrainingSession | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Count unique registered participants per session
  const registrationCount = (sessionId: string) =>
    new Set(bookings.filter((b) => b.sessionId === sessionId).map((b) => b.childId)).size;

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-white">אימונים</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            {sessions.length} אימונים קבועים במערכת
          </p>
        </div>
        <button
          onClick={() => setModalSession("new")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07100e" }}
        >
          <span className="text-base leading-none">+</span>
          יצירת אימון חדש
        </button>
      </div>

      {/* Table wrapper — scrollable on mobile */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["אימון", "תאריך", "שעה", "מיקום", "מאמן", "שנתון", "מכסה", "נרשמו", "פעולות"].map((h) => (
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
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
                    אין אימונים במערכת
                  </td>
                </tr>
              ) : (
                sessions.map((session, idx) => {
                  const ageBadge = AGE_COLORS[session.ageGroup] ?? { bg: "rgba(255,255,255,0.08)", color: "#fff" };
                  const registered = registrationCount(session.id);
                  const isFull = registered >= session.spotsTotal;
                  return (
                    <tr
                      key={session.id}
                      style={{
                        background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {/* Title */}
                      <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: ageBadge.bg, color: ageBadge.color }}
                          >
                            {session.ageGroup}
                          </span>
                          {session.title}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#c9a84c" }}>{formatISODate(session.date)}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{session.time}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(255,255,255,0.55)" }}>📍 {session.location}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(255,255,255,0.55)" }}>{session.coach}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{session.birthYear}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center font-bold" style={{ color: "rgba(255,255,255,0.6)" }}>{session.spotsTotal}</td>
                      {/* Registered count with fill indicator */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span
                          className="font-black text-sm"
                          style={{ color: isFull ? "#fca5a5" : registered > 0 ? "#c9a84c" : "rgba(255,255,255,0.3)" }}
                        >
                          {registered}
                        </span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>/{session.spotsTotal}</span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDetailsSession(session)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                            style={{
                              background: "rgba(201,168,76,0.08)",
                              color: "#c9a84c",
                              border: "1px solid rgba(201,168,76,0.2)",
                            }}
                          >
                            פרטים
                          </button>
                          <button
                            onClick={() => setModalSession(session)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              color: "rgba(255,255,255,0.55)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            עריכה
                          </button>
                          {deleteConfirmId === session.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => { onDelete(session.id); setDeleteConfirmId(null); }}
                                className="text-xs font-bold px-2 py-1.5 rounded-lg"
                                style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}
                              >
                                אישור
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-xs font-bold px-2 py-1.5 rounded-lg"
                                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}
                              >
                                לא
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(session.id)}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                              style={{
                                background: "rgba(239,68,68,0.08)",
                                color: "rgba(252,165,165,0.6)",
                                border: "1px solid rgba(239,68,68,0.15)",
                              }}
                            >
                              מחיקה
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / edit modal */}
      {modalSession !== null && (
        <SessionModal
          session={modalSession === "new" ? null : modalSession}
          coaches={coaches}
          fields={fields}
          onSave={(data) => {
            if (modalSession === "new") {
              onAdd(data);
            } else {
              onEdit(modalSession.id, data);
            }
            setModalSession(null);
          }}
          onClose={() => setModalSession(null)}
        />
      )}

      {/* Details modal */}
      {detailsSession !== null && (
        <SessionDetailsModal
          session={detailsSession}
          bookings={bookings}
          children={children}
          onClose={() => setDetailsSession(null)}
          onCancelBooking={onCancelBooking}
        />
      )}
    </section>
  );
}
