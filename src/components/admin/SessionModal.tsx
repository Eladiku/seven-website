"use client";

import { useState, useEffect } from "react";
import type { TrainingSession } from "@/data/schedule";
import type { Coach, Field } from "@/lib/storage";

type SessionFormData = Omit<TrainingSession, "id" | "spotsFilled">;

interface SessionModalProps {
  /** null = create mode, non-null = edit mode */
  session: TrainingSession | null;
  coaches: Coach[];
  fields: Field[];
  onSave: (data: SessionFormData) => void;
  onClose: () => void;
}

const EMPTY: SessionFormData = {
  title: "",
  date: "",
  time: "",
  location: "",
  coach: "",
  birthYear: "",
  ageGroup: "",
  spotsTotal: 14,
};

const AGE_GROUPS = ["U9", "U12", "U15", "U17"];
const BIRTH_YEARS = Array.from({ length: 14 }, (_, i) => String(2026 - 8 - i));

export default function SessionModal({ session, coaches, fields, onSave, onClose }: SessionModalProps) {
  const [form, setForm] = useState<SessionFormData>(EMPTY);

  useEffect(() => {
    if (session) {
      const { id: _id, spotsFilled: _sf, ...rest } = session;
      setForm(rest);
    } else {
      setForm({
        ...EMPTY,
        coach: coaches[0]?.name ?? "",
        location: fields[0]?.name ?? "",
      });
    }
  }, [session, coaches, fields]);

  function set<K extends keyof SessionFormData>(key: K, value: SessionFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.time.trim() || !form.location.trim() || !form.coach.trim() || !form.birthYear) return;
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

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="תאריך">
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                required
                className={inputCls}
                style={{ colorScheme: "dark" }}
              />
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
            <Field label="מגרש">
              {fields.length > 0 ? (
                <select value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls}>
                  {fields.map((f) => (
                    <option key={f.id} value={f.name} style={{ background: "#0d1b2a" }}>{f.name}</option>
                  ))}
                </select>
              ) : (
                <div
                  className="w-full rounded-xl px-4 py-2.5 text-xs"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }}
                >
                  הוסף מגרש תחילה
                </div>
              )}
            </Field>
            <Field label="מאמן">
              {coaches.length > 0 ? (
                <select value={form.coach} onChange={(e) => set("coach", e.target.value)} className={inputCls}>
                  {coaches.map((c) => (
                    <option key={c.id} value={c.name} style={{ background: "#0d1b2a" }}>{c.name}</option>
                  ))}
                </select>
              ) : (
                <div
                  className="w-full rounded-xl px-4 py-2.5 text-xs"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }}
                >
                  הוסף מאמן תחילה
                </div>
              )}
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
              disabled={coaches.length === 0 || fields.length === 0}
              className="flex-1 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
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
