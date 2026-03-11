"use client";

import { useMemo, useState } from "react";
import { mockParent } from "@/data/parent";
import { useParent } from "@/context/ParentContext";
import ChildrenSection from "./ChildrenSection";
import MyCardSection from "./MyCardSection";

const TODAY = "2026-03-10";

export default function DashboardShell() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  // ── All state from the single shared context ──────────────────────────────
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
    resetToMockData,
  } = useParent();

  // ── Derived data ──────────────────────────────────────────────────────────
  const selectedCard =
    cardUsage.find((c) => c.childId === selectedChild?.id) ?? null;

  const childBookings = useMemo(
    () => bookings.filter((b) => b.childId === selectedChild?.id),
    [bookings, selectedChild]
  );

  const upcomingBookings = useMemo(
    () =>
      childBookings
        .filter((b) => b.status === "confirmed" && b.date >= TODAY)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [childBookings]
  );

  const pastBookings = useMemo(
    () =>
      childBookings
        .filter((b) => b.status === "completed" || b.date < TODAY)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [childBookings]
  );

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
          שלום, {mockParent.name}
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

        {/* ── Child selector (shown when multiple children exist) ────────── */}
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

        {/* ── Section 2: My Training Card (card + upcoming + past) ─────────── */}
        <MyCardSection
          child={selectedChild}
          card={selectedCard}
          upcomingBookings={upcomingBookings}
          pastBookings={pastBookings}
          onCancel={cancelBooking}
        />

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
