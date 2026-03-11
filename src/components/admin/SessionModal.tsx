"use client";

import { useState, useEffect } from "react";
import { weekDays } from "@/data/schedule";
import type { TrainingSession } from "@/data/schedule";

type SessionFormData = Omit<TrainingSession, "id" | "spotsFilled">;

interface SessionModalProps {
  /** null = create mode, non-null = edit mode */
  session: TrainingSession | null;
  onSave: (data: SessionFormData) => void;
  onClose: () => void;
}

const EMPTY: SessionFormData = {
  title: "",
  day: "ראשון",
  time: "",
  location: "",
  coach: "",
  birthYear: "",
  ageGroup: "",
  spotsTotal: 14,
};

const AGE_GROUPS = ["U9", "U12", "U15", "U17"];
const BIRTH_YEARS = Array.from({ length: 14 }, (_, i) => String(2026 - 8 - i));

export default function SessionModal({ session, onSave, onClose }: SessionModalProps) {
  const [form, setForm] = useState<SessionFormData>(EMPTY);

  useEffect(() => {
    if (session) {
      const { id: _id, spotsFilled: _sf, ...rest } = session;
      setForm(rest);
    } else {
      setForm(EMPTY);
    }
  }, [session]);

  function set<K extends keyof SessionFormData>(key: K, value: SessionFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.time.trim() || !form.location.trim() || !form.coach.trim() || !form.birthYear) return;
    onSave(form);
  }

  const isEdit = session !== null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white font-black text-lg mb-5">
          {isEdit ? "עריכת אימון" : "יצירת אימון חדש"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <Field label="שם האימון">
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="כדורגל קבוצתי"
              required
              className={inputCls}
            />
          </Field>

          {/* Day + Time */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="יום">
              <select value={form.day} onChange={(e) => set("day", e.target.value)} className={inputCls}>
                {weekDays.map((d) => (
                  <option key={d} value={d} style={{ background: "#0d1b2a" }}>{d}</option>
                ))}
              </select>
            </Field>
            <Field label="שעה">
              <input
                type="text"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                placeholder="16:00–17:15"
                required
                className={inputCls}
              />
            </Field>
          </div>

          {/* Location + Coach */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="מיקום">
              <input
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="מגרש A"
                required
                className={inputCls}
              />
            </Field>
            <Field label="מאמן">
              <input
                type="text"
                value={form.coach}
                onChange={(e) => set("coach", e.target.value)}
                placeholder="שם המאמן"
                required
                className={inputCls}
              />
            </Field>
          </div>

          {/* Age group + Birth year */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="קבוצת גיל">
              <select value={form.ageGroup} onChange={(e) => set("ageGroup", e.target.value)} className={inputCls}>
                <option value="" disabled style={{ background: "#0d1b2a" }}>בחר</option>
                {AGE_GROUPS.map((g) => (
                  <option key={g} value={g} style={{ background: "#0d1b2a" }}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="שנתון">
              <select value={form.birthYear} onChange={(e) => set("birthYear", e.target.value)} className={inputCls}>
                <option value="" disabled style={{ background: "#0d1b2a" }}>בחר שנה</option>
                {BIRTH_YEARS.map((y) => (
                  <option key={y} value={y} style={{ background: "#0d1b2a" }}>{y}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Capacity */}
          <Field label="מכסת מקומות">
            <input
              type="number"
              min={1}
              max={50}
              value={form.spotsTotal}
              onChange={(e) => set("spotsTotal", Number(e.target.value))}
              className={inputCls}
            />
          </Field>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07100e" }}
            >
              {isEdit ? "שמירה" : "צור אימון"}
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

const inputCls =
  "w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none transition-colors bg-white/5 border border-white/10 focus:border-[rgba(201,168,76,0.5)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
