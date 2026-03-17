"use client";

import { useState } from "react";
import { useParent } from "@/context/ParentContext";
import type { ProgramCardContent, ProgramsContent } from "@/data/siteContent";

const inputCls =
  "w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white outline-none transition-colors bg-white/5 border border-white/10 focus:border-[rgba(201,168,76,0.5)]";

const textareaCls =
  "w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white outline-none transition-colors bg-white/5 border border-white/10 focus:border-[rgba(201,168,76,0.5)] resize-y min-h-[80px]";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
      {children}
    </label>
  );
}

// ── Hero editor ───────────────────────────────────────────────────────────────

function HeroEditor({
  hero,
  onSave,
}: {
  hero: ProgramsContent["hero"];
  onSave: (h: ProgramsContent["hero"]) => void;
}) {
  const [form, setForm] = useState(hero);
  const [saved, setSaved] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    onSave(form);
    setSaved(true);
  }

  return (
    <div
      className="rounded-2xl p-5 mb-4"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-white">כותרת העמוד</h3>
        <button
          onClick={handleSave}
          className="text-xs font-bold px-4 py-1.5 rounded-lg transition-all"
          style={{
            background: saved ? "rgba(34,197,94,0.12)" : "rgba(201,168,76,0.12)",
            color: saved ? "#86efac" : "#c9a84c",
            border: `1px solid ${saved ? "rgba(34,197,94,0.25)" : "rgba(201,168,76,0.25)"}`,
          }}
        >
          {saved ? "נשמר ✓" : "שמירה"}
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <Label>תווית קטנה (eyebrow)</Label>
          <input type="text" value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} className={inputCls} />
        </div>
        <div>
          <Label>כותרת ראשית</Label>
          <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </div>
        <div>
          <Label>תיאור / כיתוב משנה</Label>
          <textarea value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={textareaCls} />
        </div>
      </div>
    </div>
  );
}

// ── Single card editor ────────────────────────────────────────────────────────

const AGE_BADGE_LABEL: Record<string, string> = {
  U9: "U9 — גילאי 8–9",
  U12: "U12 — גילאי 10–12",
  U15: "U15 — גילאי 13–15",
  U17: "U17 — גילאי 16–17",
};

function CardEditor({
  card,
  onSave,
}: {
  card: ProgramCardContent;
  onSave: (updates: Partial<ProgramCardContent>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProgramCardContent>(card);
  // highlights stored as newline-separated string in the textarea
  const [highlightsText, setHighlightsText] = useState(card.highlights.join("\n"));
  const [saved, setSaved] = useState(false);

  function set<K extends keyof ProgramCardContent>(key: K, value: ProgramCardContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    const highlights = highlightsText
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean);
    onSave({ ...form, highlights });
    setSaved(true);
  }

  return (
    <div
      className="rounded-2xl overflow-hidden mb-3"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Accordion header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-right"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.25)" }}
          >
            {card.ageGroup}
          </span>
          <span className="text-sm font-bold text-white">{form.title}</span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {AGE_BADGE_LABEL[card.ageGroup]}
          </span>
        </div>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-4 space-y-3" style={{ background: "rgba(255,255,255,0.015)" }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>שם התוכנית</Label>
              <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
            </div>
            <div>
              <Label>טווח גיל</Label>
              <input type="text" value={form.ageRange} onChange={(e) => set("ageRange", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>אימונים בשבוע</Label>
              <input
                type="number"
                min={1}
                max={7}
                value={form.sessionsPerWeek}
                onChange={(e) => set("sessionsPerWeek", Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div>
              <Label>משך אימון</Label>
              <input type="text" value={form.sessionDuration} onChange={(e) => set("sessionDuration", e.target.value)} className={inputCls} placeholder="90 דק׳" />
            </div>
          </div>

          <div>
            <Label>תיאור</Label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} className={textareaCls} />
          </div>

          <div>
            <Label>נקודות בולטות — שורה אחת לכל נקודה</Label>
            <textarea
              value={highlightsText}
              onChange={(e) => { setHighlightsText(e.target.value); setSaved(false); }}
              className={textareaCls}
              style={{ minHeight: 100 }}
            />
          </div>

          <div>
            <Label>טקסט כפתור CTA</Label>
            <input type="text" value={form.ctaText} onChange={(e) => set("ctaText", e.target.value)} className={inputCls} />
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleSave}
              className="text-xs font-bold px-5 py-2 rounded-lg transition-all"
              style={{
                background: saved ? "rgba(34,197,94,0.12)" : "rgba(201,168,76,0.12)",
                color: saved ? "#86efac" : "#c9a84c",
                border: `1px solid ${saved ? "rgba(34,197,94,0.25)" : "rgba(201,168,76,0.25)"}`,
              }}
            >
              {saved ? "נשמר ✓" : "שמירה"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────

export default function ProgramsContentEditor() {
  const { siteContent, updateProgramsHero, updateProgramCard, resetSiteContent } = useParent();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-white">עמוד תוכניות</h2>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            עריכת תוכן עמוד "תוכניות האימון"
          </p>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          style={{
            color: "rgba(255,255,255,0.3)",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "transparent",
          }}
        >
          איפוס לברירת מחדל
        </button>
      </div>

      {/* Hero editor */}
      <h3
        className="text-xs font-bold tracking-widest uppercase mb-3"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        כותרת העמוד
      </h3>
      <HeroEditor hero={siteContent.programs.hero} onSave={updateProgramsHero} />

      {/* Cards editor */}
      <h3
        className="text-xs font-bold tracking-widest uppercase mb-3 mt-8"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        כרטיסי תוכניות
      </h3>
      {siteContent.programs.cards.map((card) => (
        <CardEditor
          key={card.id}
          card={card}
          onSave={(updates) => updateProgramCard(card.id, updates)}
        />
      ))}

      {/* Reset confirm modal */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.12)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-2xl mb-3">⚠️</div>
            <h3 className="text-white font-black text-lg mb-2">איפוס תוכן תוכניות</h3>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
              לאפס את כל השינויים בעמוד התוכניות לתוכן המקורי?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { resetSiteContent(); setShowResetConfirm(false); }}
                className="flex-1 py-3 rounded-xl font-black text-sm transition-all hover:opacity-80"
                style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}
              >
                כן, אפס
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
