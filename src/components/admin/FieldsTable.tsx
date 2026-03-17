"use client";

import { useMemo, useState } from "react";
import type { TrainingSession } from "@/data/schedule";
import type { Field } from "@/lib/storage";

interface FieldsTableProps {
  fields: Field[];
  sessions: TrainingSession[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}


const inputCls =
  "w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none transition-colors bg-white/5 border border-white/10 focus:border-[rgba(201,168,76,0.5)]";

function FieldModal({
  field,
  onSave,
  onClose,
}: {
  field: Field | null;
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(field?.name ?? "");

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
          {field ? "עריכת מגרש" : "הוספת מגרש"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              שם המגרש
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="מגרש A"
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
              {field ? "שמירה" : "הוספה"}
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

export default function FieldsTable({
  fields,
  sessions,
  onAdd,
  onUpdate,
  onDelete,
}: FieldsTableProps) {
  const [modalField, setModalField] = useState<Field | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<Field | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const AGE_COLORS: Record<string, { bg: string; color: string }> = {
    U9:  { bg: "rgba(96,165,250,0.12)",  color: "#93c5fd" },
    U12: { bg: "rgba(167,139,250,0.12)", color: "#c4b5fd" },
    U15: { bg: "rgba(251,146,60,0.12)",  color: "#fdba74" },
    U17: { bg: "rgba(52,211,153,0.12)",  color: "#6ee7b7" },
  };

  // Derive session stats per field name for display
  const statsMap = useMemo(() => {
    const map = new Map<
      string,
      { sessionCount: number; dates: Set<string>; coaches: Set<string>; ageGroups: Set<string> }
    >();
    for (const s of sessions) {
      if (!map.has(s.location)) {
        map.set(s.location, { sessionCount: 0, dates: new Set(), coaches: new Set(), ageGroups: new Set() });
      }
      const entry = map.get(s.location)!;
      entry.sessionCount++;
      entry.dates.add(s.date);
      entry.coaches.add(s.coach);
      entry.ageGroups.add(s.ageGroup);
    }
    return map;
  }, [sessions]);

  function handleDeleteClick(field: Field) {
    setDeleteError(null);
    setDeleteTarget(field);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const inUse = sessions.some((s) => s.location === deleteTarget.name);
    if (inUse) {
      const count = sessions.filter((s) => s.location === deleteTarget.name).length;
      setDeleteError(`לא ניתן למחוק — המגרש משויך ל־${count} אימונים`);
      return;
    }
    onDelete(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-white">מגרשים</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            {fields.length} מגרשים פעילים
          </p>
        </div>
        <button
          onClick={() => setModalField("new")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07100e" }}
        >
          <span className="text-base leading-none">+</span>
          הוספת מגרש
        </button>
      </div>

      {fields.length === 0 ? (
        <div
          className="rounded-2xl py-10 text-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>אין מגרשים במערכת</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.12)" }}>הוסף מגרשים לפני יצירת אימונים</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["שם המגרש", "אימונים", "תאריכים", "מאמנים", "קבוצות גיל", "פעולות"].map((h) => (
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
                {fields.map((field, idx) => {
                  const stats = statsMap.get(field.name);
                  return (
                    <tr
                      key={field.id}
                      style={{
                        background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {/* Field name */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                            style={{ background: "rgba(201,168,76,0.08)" }}
                          >
                            🏟
                          </div>
                          <span className="font-black text-white">{field.name}</span>
                        </div>
                      </td>
                      {/* Session count */}
                      <td className="px-4 py-4 text-center">
                        <span className="font-black text-lg" style={{ color: stats ? "#c9a84c" : "rgba(255,255,255,0.2)" }}>
                          {stats?.sessionCount ?? 0}
                        </span>
                      </td>
                      {/* Active dates */}
                      <td className="px-4 py-4">
                        {stats ? (
                          <div className="flex flex-wrap gap-1">
                            {[...stats.dates]
                              .sort()
                              .map((date) => (
                                <span
                                  key={date}
                                  className="text-xs font-semibold px-2 py-0.5 rounded"
                                  style={{ background: "rgba(201,168,76,0.08)", color: "#c9a84c" }}
                                >
                                  {date}
                                </span>
                              ))}
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>—</span>
                        )}
                      </td>
                      {/* Coaches */}
                      <td className="px-4 py-4">
                        {stats ? (
                          <div className="flex flex-col gap-0.5">
                            {[...stats.coaches].sort().map((coach) => (
                              <span key={coach} className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                                {coach}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>—</span>
                        )}
                      </td>
                      {/* Age groups */}
                      <td className="px-4 py-4">
                        {stats ? (
                          <div className="flex flex-wrap gap-1">
                            {[...stats.ageGroups].sort().map((g) => {
                              const c = AGE_COLORS[g] ?? { bg: "rgba(255,255,255,0.08)", color: "#fff" };
                              return (
                                <span
                                  key={g}
                                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: c.bg, color: c.color }}
                                >
                                  {g}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>—</span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setModalField(field)}
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
                            onClick={() => handleDeleteClick(field)}
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {modalField !== null && (
        <FieldModal
          field={modalField === "new" ? null : modalField}
          onSave={(name) => {
            if (modalField === "new") {
              onAdd(name);
            } else {
              onUpdate(modalField.id, name);
            }
            setModalField(null);
          }}
          onClose={() => setModalField(null)}
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
            <h3 className="text-white font-black text-lg mb-2">מחיקת מגרש</h3>
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
