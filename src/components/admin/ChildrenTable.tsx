"use client";

import { useMemo, useState } from "react";
import type { Child, Booking, TrainingCard } from "@/data/parent";

interface ChildrenTableProps {
  children: Child[];
  bookings: Booking[];
  cardUsage: TrainingCard[];
  cardDevOverrides: Record<string, number>;
  parentName: string;
  onAdd: (data: Omit<Child, "id">) => void;
  onEdit: (id: string, updates: Omit<Child, "id">) => void;
  onDelete: (id: string) => void;
  onAssignCard: (childId: string) => void;
  onRemoveCard: (childId: string) => void;
}

const TODAY = "2026-03-10";
const BIRTH_YEARS = Array.from({ length: 14 }, (_, i) => String(2026 - 8 - i));

const inputCls =
  "w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none transition-colors bg-white/5 border border-white/10 focus:border-[rgba(201,168,76,0.5)]";

function ChildModal({
  child,
  onSave,
  onClose,
}: {
  child: Child | null;
  onSave: (data: Omit<Child, "id">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(child?.name ?? "");
  const [birthYear, setBirthYear] = useState(child?.birthYear ?? BIRTH_YEARS[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !birthYear) return;
    onSave({ name: name.trim(), birthYear });
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
          {child ? "עריכת ילד" : "הוספת ילד"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              שם הילד
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ישראל ישראלי"
              required
              autoFocus
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              שנת לידה
            </label>
            <select
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className={inputCls}
            >
              {BIRTH_YEARS.map((y) => (
                <option key={y} value={y} style={{ background: "#0d1b2a" }}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07100e" }}
            >
              {child ? "שמירה" : "הוספה"}
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

export default function ChildrenTable({
  children,
  bookings,
  cardUsage,
  cardDevOverrides,
  parentName,
  onAdd,
  onEdit,
  onDelete,
  onAssignCard,
  onRemoveCard,
}: ChildrenTableProps) {
  const [modalChild, setModalChild] = useState<Child | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<Child | null>(null);

  const rows = useMemo(
    () =>
      children.map((child) => {
        const card = cardUsage.find((c) => c.childId === child.id) ?? null;
        const allBookings = bookings.filter((b) => b.childId === child.id);
        const usedSessions =
          child.id in cardDevOverrides
            ? cardDevOverrides[child.id]
            : allBookings.length;
        const remaining = card ? Math.max(0, card.totalSessions - usedSessions) : null;
        const cardActive = card !== null && (remaining ?? 0) > 0;
        const upcomingCount = bookings.filter(
  (b) => b.childId === child.id && b.status === "confirmed"
  ).length;
        return { child, card, usedSessions, remaining, cardActive, upcomingCount };
      }),
    [children, bookings, cardUsage, cardDevOverrides]
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-white">ילדים</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            {children.length} ילדים רשומים במערכת
          </p>
        </div>
        <button
          onClick={() => setModalChild("new")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07100e" }}
        >
          <span className="text-base leading-none">+</span>
          הוספת ילד
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["שם הילד", "שנתון", "שם הורה", "כרטיסייה פעילה", "יתרה נותרת", "אימונים קרובים", "פעולות"].map((h) => (
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
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
                    אין ילדים במערכת
                  </td>
                </tr>
              ) : (
                rows.map(({ child, card, remaining, cardActive, upcomingCount }, idx) => (
                  <tr
                    key={child.id}
                    style={{
                      background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                          style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c" }}
                        >
                          {child.name[0]}
                        </div>
                        <span className="font-bold text-white">{child.name}</span>
                      </div>
                    </td>
                    {/* Birth year */}
                    <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {child.birthYear}
                    </td>
                    {/* Parent */}
                    <td className="px-4 py-3 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {parentName}
                    </td>
                    {/* Card active */}
                    <td className="px-4 py-3">
                      {card ? (
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={
                            cardActive
                              ? { background: "rgba(34,197,94,0.12)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)" }
                              : { background: "rgba(239,68,68,0.10)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }
                          }
                        >
                          {cardActive ? "פעילה ✓" : "אזלה"}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>אין כרטיסייה</span>
                      )}
                    </td>
                    {/* Remaining */}
                    <td className="px-4 py-3 text-center">
                      {remaining !== null ? (
                        <span
                          className="font-black text-sm"
                          style={{ color: remaining <= 2 ? "#fca5a5" : remaining <= 5 ? "#fdba74" : "#c9a84c" }}
                        >
                          {remaining}
                        </span>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>
                      )}
                    </td>
                    {/* Upcoming */}
                    <td className="px-4 py-3 text-center">
                      {upcomingCount > 0 ? (
                        <span className="font-black text-sm" style={{ color: "#c9a84c" }}>
                          {upcomingCount}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>0</span>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModalChild(child)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.55)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          עריכה
                        </button>
                        {card ? (
                          <button
                            onClick={() => onRemoveCard(child.id)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                            style={{
                              background: "rgba(239,68,68,0.08)",
                              color: "rgba(252,165,165,0.6)",
                              border: "1px solid rgba(239,68,68,0.15)",
                            }}
                          >
                            הסר כרטיסייה
                          </button>
                        ) : (
                          <button
                            onClick={() => onAssignCard(child.id)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                            style={{
                              background: "rgba(201,168,76,0.08)",
                              color: "#c9a84c",
                              border: "1px solid rgba(201,168,76,0.2)",
                            }}
                          >
                            הוסף כרטיסייה
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(child)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit modal */}
      {modalChild !== null && (
        <ChildModal
          child={modalChild === "new" ? null : modalChild}
          onSave={(data) => {
            if (modalChild === "new") {
              onAdd(data);
            } else {
              onEdit(modalChild.id, data);
            }
            setModalChild(null);
          }}
          onClose={() => setModalChild(null)}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget !== null && (() => {
        const childBookings = bookings.filter((b) => b.childId === deleteTarget.id);
        const hasCard = cardUsage.some((c) => c.childId === deleteTarget.id);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.8)" }}
            onClick={() => setDeleteTarget(null)}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: "#0d1b2a", border: "1px solid rgba(239,68,68,0.25)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-black text-lg mb-2">מחיקת ילד</h3>
              <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                האם למחוק את <span className="text-white font-bold">{deleteTarget.name}</span>?
              </p>
              {(childBookings.length > 0 || hasCard) && (
                <div
                  className="mt-3 mb-4 rounded-xl px-4 py-3 text-xs"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}
                >
                  פעולה זו תמחק גם:
                  {childBookings.length > 0 && (
                    <div className="mt-1">· {childBookings.length} הרשמות</div>
                  )}
                  {hasCard && <div className="mt-0.5">· כרטיסייה אימונים</div>}
                </div>
              )}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { onDelete(deleteTarget.id); setDeleteTarget(null); }}
                  className="flex-1 py-3 rounded-xl font-black text-sm"
                  style={{ background: "rgba(239,68,68,0.2)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  מחיקה
                </button>
                <button
                  onClick={() => setDeleteTarget(null)}
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
            </div>
          </div>
        );
      })()}
    </section>
  );
}
