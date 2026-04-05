"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParent } from "@/context/ParentContext";
import { toLocalISODate } from "@/lib/scheduleUtils";
import ChildrenSection from "./ChildrenSection";
import MyCardSection from "./MyCardSection";

export default function DashboardShell() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const router = useRouter();

  const {
    children,
    addChild,
    editChild,
    deleteChild,
    selectedChildId,
    setSelectedChildId,
    selectedChild,
    bookings,
    cancelBooking,
    cardUsage,
    sessions,
    assignCard,
    removeCard,
    cardDevOverrides,
    devSetCardUsed,
    resetToMockData,
    currentUser,
    isAdmin,
    isHydrating,
  } = useParent();

  // Guard: redirect once hydration is complete.
  useEffect(() => {
    if (isHydrating) return;
    if (isAdmin) { router.replace("/admin"); return; }
    if (!currentUser) { router.replace("/login"); return; }
  }, [isHydrating, isAdmin, currentUser, router]);

  // ── Derived data — all hooks must run unconditionally ─────────────────────
  const selectedCard =
    cardUsage.find((c) => c.childId === selectedChild?.id) ?? null;

  const devUsedOverride =
    selectedChild && selectedChild.id in cardDevOverrides
      ? cardDevOverrides[selectedChild.id]
      : null;

  const sessionMap = useMemo(
    () => Object.fromEntries(sessions.map((s) => [s.id, s])),
    [sessions]
  );

  const today = toLocalISODate(new Date());

  const childBookings = useMemo(
    () => bookings.filter((b) => b.childId === selectedChild?.id),
    [bookings, selectedChild]
  );

  const upcomingBookings = useMemo(
    () =>
      childBookings
        .filter((b) => {
          const s = sessionMap[b.sessionId];
          return s && b.status === "confirmed" && s.date >= today;
        })
        .sort((a, b) => (sessionMap[a.sessionId]?.date ?? "").localeCompare(sessionMap[b.sessionId]?.date ?? "")),
    [childBookings, sessionMap, today]
  );

  const pastBookings = useMemo(
    () =>
      childBookings
        .filter((b) => {
          const s = sessionMap[b.sessionId];
          // Skip orphaned bookings (session no longer exists in sessionMap)
          if (!s) return false;
          return b.status === "completed" || s.date < today;
        })
        .sort((a, b) => (sessionMap[b.sessionId]?.date ?? "").localeCompare(sessionMap[a.sessionId]?.date ?? "")),
    [childBookings, sessionMap, today]
  );

  // ── Dev controls ──────────────────────────────────────────────────────────
  const total = selectedCard?.totalSessions ?? 10;

  // Render nothing until auth is resolved — must be after all hooks.
  if (isHydrating || isAdmin || !currentUser) return null;
  const devButtons: { label: string; used: number }[] = [
    { label: "הגדר יתרה ל-0", used: total },
    { label: "הגדר יתרה ל-1", used: total - 1 },
    { label: "מלא ל-10 אימונים", used: 0 },
  ];

  return (
    <div style={{ background: "#070d17", minHeight: "100vh" }}>
      {/* Page header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-12 pb-8 max-w-2xl mx-auto">
        <span
          className="inline-block text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: "#c9a84c" }}
        >
          אזור אישי
        </span>
        <h1 className="text-4xl font-black text-white mb-1">
          שלום, {currentUser?.name ?? ""}
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          ניהול ילדים, כרטיסיות ואימונים
        </p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto pb-16 space-y-10">
        {/* ── Section 1: Children ───────────────────────────────────────────── */}
        <ChildrenSection
          children={children}
          onAdd={addChild}
          onEdit={editChild}
          onDelete={deleteChild}
        />

        {/* ── Child selector ────────────────────────────────────────────────── */}
        {children.length > 1 && (
          <div>
            <p
              className="text-xs font-semibold mb-3 tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              הצג מידע עבור
            </p>
            <div className="flex flex-wrap gap-2">
              {children.map((child) => {
                const isSelected = child.id === selectedChildId;
                return (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all"
                    style={
                      isSelected
                        ? {
                            background: "rgba(201,168,76,0.15)",
                            border: "1px solid rgba(201,168,76,0.5)",
                            color: "#c9a84c",
                          }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.55)",
                          }
                    }
                  >
                    {child.name}
                    <span
                      className="text-xs font-normal"
                      style={{
                        color: isSelected
                          ? "rgba(201,168,76,0.6)"
                          : "rgba(255,255,255,0.3)",
                      }}
                    >
                      ({child.birthYear})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ── Section 2: My Training Card ───────────────────────────────────── */}
        <MyCardSection
          child={selectedChild}
          card={selectedCard}
          upcomingBookings={upcomingBookings}
          pastBookings={pastBookings}
          sessionMap={sessionMap}
          onCancel={cancelBooking}
          devUsedOverride={devUsedOverride}
        />

        {/* ── Dev tools ─────────────────────────────────────────────────────── */}
        {selectedChild && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.1)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded"
                style={{
                  background: "rgba(251,146,60,0.12)",
                  color: "#fdba74",
                  border: "1px solid rgba(251,146,60,0.2)",
                }}
              >
                DEV
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                כלי בדיקה — {selectedChild.name}
                {devUsedOverride !== null && (
                  <span style={{ color: "#fdba74" }}>
                    {" "}· פעיל (יתרה: {total - devUsedOverride})
                  </span>
                )}
              </span>
            </div>

            {/* Card assign / remove */}
            <div className="mb-3 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {!selectedCard ? (
                <button
                  onClick={() => assignCard(selectedChild.id)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: "rgba(201,168,76,0.1)",
                    color: "#c9a84c",
                    border: "1px solid rgba(201,168,76,0.25)",
                  }}
                >
                  + הוסף כרטיסייה
                </button>
              ) : (
                <button
                  onClick={() => removeCard(selectedChild.id)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    color: "rgba(252,165,165,0.7)",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  הסר כרטיסייה
                </button>
              )}
            </div>

            {/* Balance override buttons — only when card exists */}
            {selectedCard && (
              <div className="flex flex-wrap gap-2">
                {devButtons.map(({ label, used }) => {
                  const isActive = devUsedOverride === used;
                  return (
                    <button
                      key={label}
                      onClick={() =>
                        devSetCardUsed(selectedChild.id, isActive ? null : used)
                      }
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={
                        isActive
                          ? {
                              background: "rgba(251,146,60,0.15)",
                              color: "#fdba74",
                              border: "1px solid rgba(251,146,60,0.35)",
                            }
                          : {
                              background: "rgba(255,255,255,0.04)",
                              color: "rgba(255,255,255,0.4)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }
                      }
                    >
                      {label}
                      {isActive && " ✓"}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Reset demo data ───────────────────────────────────────────────── */}
        <div
          className="pt-6 border-t flex justify-center"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-xs font-semibold px-4 py-2 rounded-lg transition-all"
            style={{
              color: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.2)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
            }}
          >
            איפוס נתוני דמו
          </button>
        </div>

        {/* ── Reset confirmation modal ──────────────────────────────────────── */}
        {showResetConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.8)" }}
            onClick={() => setShowResetConfirm(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6"
              style={{
                background: "#0d1b2a",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-2xl mb-3">⚠️</div>
              <h3 className="text-white font-black text-lg mb-2">
                איפוס נתוני דמו
              </h3>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
                לאפס את כל הנתונים? פעולה זו תמחק ילדים, הזמנות ואימונים שנרשמו.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    resetToMockData();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-3 rounded-xl font-black text-sm transition-all hover:opacity-80"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    color: "#fca5a5",
                    border: "1px solid rgba(239,68,68,0.3)",
                  }}
                >
                  כן, אפס הכל
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm"
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
      </div>
    </div>
  );
}
