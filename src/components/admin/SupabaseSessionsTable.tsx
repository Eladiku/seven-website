"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  target_birth_year: number;
  spots_total: number;
  spots_filled: number;
}

type SessionFormData = Omit<Session, "id" | "spots_filled">;

// ─── Constants ────────────────────────────────────────────────────────────────

const BIRTH_YEARS = Array.from({ length: 9 }, (_, i) => 2010 + i); // 2010–2018

const EMPTY_FORM: SessionFormData = {
  title: "",
  date: "",
  time: "",
  location: "",
  target_birth_year: 2015,
  spots_total: 14,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SupabaseSessionsTable() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterOccupancy, setFilterOccupancy] = useState<"all" | "available" | "almost" | "full">("all");
  const [sortOrder, setSortOrder] = useState<"default" | "most-full" | "least-full">("default");

  // Modal: null = closed, "new" = create, Session = edit
  const [modalSession, setModalSession] = useState<Session | "new" | null>(null);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Mutation state
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterYear, filterDate]);

  // ── Data fetching ────────────────────────────────────────────────────────────

  async function fetchSessions() {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    let query = supabase
      .from("sessions")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (filterYear !== "all") query = query.eq("target_birth_year", filterYear);
    if (filterDate) query = query.eq("date", filterDate);

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setSessions(data ?? []);
    }
    setLoading(false);
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  async function handleSave(formData: SessionFormData) {
    setSaving(true);
    setError(null);
    if (modalSession === "new") {
      const { error: insertError } = await supabase
        .from("sessions")
        .insert([{ ...formData, spots_filled: 0 }]);
      if (insertError) { setError(insertError.message); setSaving(false); return; }
      setSuccessMsg("האימון נוצר בהצלחה");
    } else if (modalSession) {
      const { error: updateError } = await supabase
        .from("sessions")
        .update(formData)
        .eq("id", modalSession.id);
      if (updateError) { setError(updateError.message); setSaving(false); return; }
      setSuccessMsg("האימון נשמר בהצלחה");
    }
    setSaving(false);
    setModalSession(null);
    fetchSessions();
  }

  async function handleDelete(id: string) {
    setSaving(true);
    setError(null);
    const { error: deleteError } = await supabase
      .from("sessions")
      .delete()
      .eq("id", id);
    if (deleteError) { setError(deleteError.message); setSaving(false); return; }
    setSuccessMsg("האימון נמחק בהצלחה");
    setSaving(false);
    setDeleteConfirmId(null);
    fetchSessions();
  }

  // ── Filters ──────────────────────────────────────────────────────────────────

  function resetFilters() {
    setFilterYear("all");
    setFilterDate("");
    setFilterOccupancy("all");
    setSortOrder("default");
  }

  const hasActiveFilters = filterYear !== "all" || filterDate !== "" || filterOccupancy !== "all" || sortOrder !== "default";

  const filteredSessions = filterOccupancy === "all"
    ? sessions
    : sessions.filter((s) => {
        const ratio = s.spots_total > 0 ? s.spots_filled / s.spots_total : 0;
        if (filterOccupancy === "full")   return ratio >= 1;
        if (filterOccupancy === "almost") return ratio >= 0.8 && ratio < 1;
        return ratio < 0.8;
      });

  const displaySessions = sortOrder === "default"
    ? filteredSessions
    : [...filteredSessions].sort((a, b) => {
        const ra = a.spots_total > 0 ? a.spots_filled / a.spots_total : 0;
        const rb = b.spots_total > 0 ? b.spots_filled / b.spots_total : 0;
        return sortOrder === "most-full" ? rb - ra : ra - rb;
      });

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-white">אימונים</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            {loading ? "טוען..." : `${displaySessions.length} אימונים`}
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

      {/* Filters */}
      <div
        className="flex flex-wrap items-end gap-3 mb-5 p-4 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
            שנתון
          </label>
          <select
            value={filterYear}
            onChange={(e) =>
              setFilterYear(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="rounded-xl px-3 py-2 text-sm font-semibold outline-none appearance-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: filterYear !== "all" ? "#c9a84c" : "rgba(255,255,255,0.6)",
              minWidth: "110px",
            }}
          >
            <option value="all">כל השנתונים</option>
            {BIRTH_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
            תאריך
          </label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm font-semibold outline-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: filterDate ? "#c9a84c" : "rgba(255,255,255,0.6)",
              colorScheme: "dark",
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
            תפוסה
          </label>
          <select
            value={filterOccupancy}
            onChange={(e) => setFilterOccupancy(e.target.value as typeof filterOccupancy)}
            className="rounded-xl px-3 py-2 text-sm font-semibold outline-none appearance-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: filterOccupancy !== "all" ? "#c9a84c" : "rgba(255,255,255,0.6)",
              minWidth: "120px",
            }}
          >
            <option value="all">כל התפוסות</option>
            <option value="available">פנוי</option>
            <option value="almost">כמעט מלא</option>
            <option value="full">מלא</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
            מיון
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
            className="rounded-xl px-3 py-2 text-sm font-semibold outline-none appearance-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: sortOrder !== "default" ? "#c9a84c" : "rgba(255,255,255,0.6)",
              minWidth: "130px",
            }}
          >
            <option value="default">תאריך + שעה</option>
            <option value="most-full">הכי מלא קודם</option>
            <option value="least-full">הכי פנוי קודם</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
            style={{
              background: "rgba(239,68,68,0.1)",
              color: "rgba(252,165,165,0.8)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            ✕ איפוס סינון
          </button>
        )}
      </div>

      {/* Success */}
      {successMsg && (
        <div
          className="mb-4 px-4 py-3 rounded-xl text-sm"
          style={{ background: "rgba(0,200,83,0.08)", color: "#6ee7b7", border: "1px solid rgba(0,200,83,0.2)" }}
        >
          ✓ {successMsg}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-xl text-sm"
          style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          שגיאה: {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["אימון", "תאריך", "שעה", "מיקום", "שנתון", "מכסה", "נרשמו", "פעולות"].map((h) => (
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
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center">
                    <div
                      className="inline-block w-5 h-5 rounded-full border-2 animate-spin"
                      style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "#c9a84c" }}
                    />
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
                    לא נמצאו אימונים
                  </td>
                </tr>
              ) : (
                displaySessions.map((session, idx) => {
                  const isFull = session.spots_filled >= session.spots_total;
                  const ratio = session.spots_total > 0 ? session.spots_filled / session.spots_total : 0;
                  const pct = Math.min(100, Math.round(ratio * 100));
                  const occupancy =
                    isFull
                      ? { label: "מלא",       badge: "bg-red-500/20 text-red-400 border border-red-500/30",    bar: "#ef4444" }
                      : ratio >= 0.8
                      ? { label: "כמעט מלא",  badge: "bg-orange-400/20 text-orange-300 border border-orange-400/30", bar: "#fb923c" }
                      : { label: "פנוי",      badge: "bg-green-500/20 text-green-400 border border-green-500/30",    bar: "#22c55e" };
                  return (
                    <tr
                      key={session.id}
                      style={{
                        background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <td className="px-4 py-3 font-bold text-white whitespace-nowrap">{session.title}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#c9a84c" }}>{formatDate(session.date)}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{session.time}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(255,255,255,0.55)" }}>📍 {session.location}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{session.target_birth_year}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center font-bold" style={{ color: "rgba(255,255,255,0.6)" }}>{session.spots_total}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 min-w-[100px]">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                              {session.spots_filled}
                              <span className="text-xs font-normal" style={{ color: "rgba(255,255,255,0.25)" }}>
                                /{session.spots_total}
                              </span>
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${occupancy.badge}`}>
                              {occupancy.label}
                            </span>
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: occupancy.bar }} />
                          </div>
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setModalSession(session)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.1)" }}
                          >
                            עריכה
                          </button>
                          {deleteConfirmId === session.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(session.id)}
                                disabled={saving}
                                className="text-xs font-bold px-2 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}
                              >
                                {saving ? "..." : "אישור"}
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
                              style={{ background: "rgba(239,68,68,0.08)", color: "rgba(252,165,165,0.6)", border: "1px solid rgba(239,68,68,0.15)" }}
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
        <SessionFormModal
          session={modalSession === "new" ? null : modalSession}
          saving={saving}
          onSave={handleSave}
          onClose={() => setModalSession(null)}
        />
      )}
    </section>
  );
}

// ─── Inline modal ─────────────────────────────────────────────────────────────

interface SessionFormModalProps {
  session: Session | null; // null = create mode
  saving: boolean;
  onSave: (data: SessionFormData) => void;
  onClose: () => void;
}

const BIRTH_YEAR_OPTIONS = Array.from({ length: 9 }, (_, i) => 2010 + i);

const inputCls =
  "w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none transition-colors bg-white/5 border border-white/10 focus:border-[rgba(201,168,76,0.5)]";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function SessionFormModal({ session, saving, onSave, onClose }: SessionFormModalProps) {
  const [form, setForm] = useState<SessionFormData>(
    session
      ? { title: session.title, date: session.date, time: session.time, location: session.location, target_birth_year: session.target_birth_year, spots_total: session.spots_total }
      : EMPTY_FORM
  );
  const [formError, setFormError] = useState<string | null>(null);

  function set<K extends keyof SessionFormData>(key: K, value: SessionFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.time.trim() || !form.location.trim()) return;
    if (!Number.isInteger(form.spots_total) || form.spots_total < 1) {
      setFormError("מכסת המקומות חייבת להיות מספר שלם גדול מ-0");
      return;
    }
    setFormError(null);
    onSave(form);
  }

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
          {session ? "עריכת אימון" : "יצירת אימון חדש"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="שם האימון">
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="כדורגל קבוצתי"
              required
              className={inputCls}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="תאריך">
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                required
                className={inputCls}
                style={{ colorScheme: "dark" }}
              />
            </FormField>
            <FormField label="שעה">
              <input
                type="text"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                placeholder="16:00–17:15"
                required
                className={inputCls}
              />
            </FormField>
          </div>

          <FormField label="מיקום">
            <input
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="מגרש ראשי"
              required
              className={inputCls}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="שנתון">
              <select
                value={form.target_birth_year}
                onChange={(e) => set("target_birth_year", Number(e.target.value))}
                className={inputCls}
              >
                {BIRTH_YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y} style={{ background: "#0d1b2a" }}>{y}</option>
                ))}
              </select>
            </FormField>
            <FormField label="מכסת מקומות">
              <input
                type="number"
                min={1}
                max={50}
                value={form.spots_total}
                onChange={(e) => set("spots_total", Number(e.target.value))}
                className={inputCls}
              />
            </FormField>
          </div>

          {formError && (
            <p className="text-xs font-semibold" style={{ color: "#fca5a5" }}>{formError}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07100e" }}
            >
              {saving ? "שומר..." : session ? "שמירה" : "צור אימון"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl font-bold text-sm"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
