"use client";

import { useState } from "react";
import type { Child } from "@/data/parent";

interface ChildrenSectionProps {
  children: Child[];
  onAdd: (child: Omit<Child, "id">) => void;
  onEdit: (id: string, updates: Omit<Child, "id">) => void;
  onDelete: (id: string) => void;
}

interface ModalState {
  mode: "add" | "edit";
  childId?: string;
  name: string;
  birthYear: string;
}

const CURRENT_YEAR = 2026;
const BIRTH_YEAR_OPTIONS = Array.from({ length: 14 }, (_, i) =>
  String(CURRENT_YEAR - 8 - i)
);

export default function ChildrenSection({
  children,
  onAdd,
  onEdit,
  onDelete,
}: ChildrenSectionProps) {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  function openAdd() {
    setModal({ mode: "add", name: "", birthYear: "" });
  }

  function openEdit(child: Child) {
    setModal({ mode: "edit", childId: child.id, name: child.name, birthYear: child.birthYear });
  }

  function closeModal() {
    setModal(null);
  }

  function handleSubmit() {
    if (!modal || !modal.name.trim() || !modal.birthYear) return;
    if (modal.mode === "add") {
      onAdd({ name: modal.name.trim(), birthYear: modal.birthYear });
    } else if (modal.childId) {
      onEdit(modal.childId, { name: modal.name.trim(), birthYear: modal.birthYear });
    }
    closeModal();
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-white">הילדים שלי</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
            color: "#07100e",
          }}
        >
          <span className="text-base leading-none">+</span>
          הוסף ילד
        </button>
      </div>

      {children.length === 0 ? (
        <div
          className="rounded-2xl py-10 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="text-3xl mb-2">👦</div>
          <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
            לא נוספו ילדים עדיין
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {children.map((child) => (
            <div
              key={child.id}
              className="rounded-2xl px-5 py-4 flex items-center justify-between"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div>
                <div className="text-white font-bold text-base">{child.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(201,168,76,0.7)" }}>
                  שנתון {child.birthYear}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(child)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.55)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  עריכה
                </button>
                {deleteConfirmId === child.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onDelete(child.id);
                        setDeleteConfirmId(null);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold"
                      style={{
                        background: "rgba(239,68,68,0.15)",
                        color: "#fca5a5",
                        border: "1px solid rgba(239,68,68,0.3)",
                      }}
                    >
                      אישור
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1.5 rounded-lg text-xs font-bold"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      ביטול
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(child.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
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
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={closeModal}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{
              background: "#0d1b2a",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-black text-lg mb-5">
              {modal.mode === "add" ? "הוספת ילד/ה" : "עריכת ילד/ה"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  שם הילד/ה
                </label>
                <input
                  type="text"
                  value={modal.name}
                  onChange={(e) => setModal((m) => m && { ...m, name: e.target.value })}
                  placeholder="שם פרטי"
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  שנת לידה
                </label>
                <select
                  value={modal.birthYear}
                  onChange={(e) => setModal((m) => m && { ...m, birthYear: e.target.value })}
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <option value="" disabled style={{ background: "#0d1b2a" }}>
                    בחר שנה
                  </option>
                  {BIRTH_YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y} style={{ background: "#0d1b2a" }}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={!modal.name.trim() || !modal.birthYear}
                className="flex-1 py-3 rounded-xl font-black text-sm transition-all disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
                  color: "#07100e",
                }}
              >
                {modal.mode === "add" ? "הוספה" : "שמירה"}
              </button>
              <button
                onClick={closeModal}
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
      )}
    </section>
  );
}
