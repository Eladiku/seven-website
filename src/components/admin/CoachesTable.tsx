"use client";

import { useMemo, useState } from "react";
import type { TrainingSession } from "@/data/schedule";
import type { Coach } from "@/lib/storage";

interface CoachesTableProps {
  coaches: Coach[];
  sessions: TrainingSession[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

const inputCls =
  "w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none transition-colors bg-white/5 border border-white/10 focus:border-[rgba(201,168,76,0.5)]";

function CoachModal({
  coach,
  onSave,
  onClose,
}: {
  coach: Coach | null;
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(coach?.name ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white font-black text-lg mb-5">
          {coach ? "עריכת מאמן" : "הוספת מאמן"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              שם המאמן
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם מלא"
              required
              autoFocus
              className={inputCls}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07100e" }}
            >
              {coach ? "שמירה" : "הוספה"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl font-bold text-sm"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CoachesTable({
  coaches,
  sessions,
  onAdd,
  onUpdate,
  onDelete,
}: CoachesTableProps) {
  const [modalCoach, setModalCoach] = useState<Coach | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<Coach | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Derive session stats per coach for display
  const statsMap = useMemo(() => {
    const map = new Map<
      string,
      { sessionCount: number; locations: Set<string>; ageGroups: Set<string> }
    >();
    for (const s of sessions) {
      if (!map.has(s.coach)) {
        map.set(s.coach, { sessionCount: 0, locations: new Set(), ageGroups: new Set() });
      }
      const entry = map.get(s.coach)!;
      entry.sessionCount++;
      entry.locations.add(s.location);
      entry.ageGroups.add(s.ageGroup);
    }
    return map;
  }, [sessions]);

  const AGE_COLORS: Record<string, { bg: string; color: string }> = {
    U9:  { bg: "rgba(96,165,250,0.12)",  color: "#93c5fd" },
    U12: { bg: "rgba(167,139,250,0.12)", color: "#c4b5fd" },
    U15: { bg: "rgba(251,146,60,0.12)",  color: "#fdba74" },
    U17: { bg: "rgba(52,211,153,0.12)",  color: "#6ee7b7" },
  };

  function handleDeleteClick(coach: Coach) {
    setDeleteError(null);
    setDeleteTarget(coach);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const inUse = sessions.some((s) => s.coach === deleteTarget.name);
    if (inUse) {
      const count = sessions.filter((s) => s.coach === deleteTarget.name).length;
      setDeleteError(`לא ניתן למחוק — המאמן משויך ל־${count} אימונים`);
      return;
    }
    onDelete(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-white">מאמנים</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            {coaches.length} מאמנים פעילים
          </p>
        </div>
        <button
          onClick={() => setModalCoach("new")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07100e" }}
        >
          <span className="text-base leading-none">+</span>
          הוספת מאמן
        </button>
      </div>

      {coaches.length === 0 ? (
        <div
          className="rounded-2xl py-10 text-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>אין מאמנים במערכת</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.12)" }}>הוסף מאמנים לפני יצירת אימונים</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coaches.map((coach) => {
            const stats = statsMap.get(coach.name);
            return (
              <div
                key={coach.id}
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Name + actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                      style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c" }}
                    >
                      {coach.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-black text-white text-base">{coach.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {stats ? `${stats.sessionCount} אימון${stats.sessionCount !== 1 ? "ים" : ""} בשבוע` : "אין אימונים"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModalCoach(coach)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.55)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      עריכה
                    </button>
                    <button
                      onClick={() => handleDeleteClick(coach)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg"
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        color: "rgba(252,165,165,0.6)",
                        border: "1px solid rgba(239,68,68,0.15)",
                      }}
                    >
                      מחיקה
                    </button>
                  </div>
                </div>

                {stats ? (
                  <>
                    {/* Age groups */}
                    <div className="mb-3">
                      <div className="text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>קבוצות גיל</div>
                      <div className="flex flex-wrap gap-1.5">
                        {[...stats.ageGroups].sort().map((g) => {
                          const c = AGE_COLORS[g] ?? { bg: "rgba(255,255,255,0.08)", color: "#fff" };
                          return (
                            <span
                              key={g}
                              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                              style={{ background: c.bg, color: c.color }}
                            >
                              {g}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    {/* Locations */}
                    <div>
                      <div className="text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>מגרשים</div>
                      <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {[...stats.locations].sort().join(" · ")}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>לא משויך לאימונים</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit modal */}
      {modalCoach !== null && (
        <CoachModal
          coach={modalCoach === "new" ? null : modalCoach}
          onSave={(name) => {
            if (modalCoach === "new") {
              onAdd(name);
            } else {
              onUpdate(modalCoach.id, name);
            }
            setModalCoach(null);
          }}
          onClose={() => setModalCoach(null)}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: "#0d1b2a", border: "1px solid rgba(239,68,68,0.25)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-black text-lg mb-2">מחיקת מאמן</h3>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
              האם למחוק את <span className="text-white font-bold">{deleteTarget.name}</span>?
            </p>
            {deleteError && (
              <div
                className="mb-4 rounded-xl px-4 py-3 text-xs font-semibold"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}
              >
                {deleteError}
              </div>
            )}
            {!deleteError && (
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3 rounded-xl font-black text-sm"
                  style={{ background: "rgba(239,68,68,0.2)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  מחיקה
                </button>
                <button
                  onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
                  className="px-5 py-3 rounded-xl font-bold text-sm"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  ביטול
                </button>
              </div>
            )}
            {deleteError && (
              <button
                onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
                className="w-full py-3 rounded-xl font-bold text-sm mt-2"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                סגירה
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
