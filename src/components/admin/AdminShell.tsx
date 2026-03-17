"use client";

import { useState } from "react";
import Link from "next/link";
import { mockParent } from "@/data/parent";
import { useParent } from "@/context/ParentContext";
import SessionsTable from "./SessionsTable";
import BookingsTable from "./BookingsTable";
import ChildrenTable from "./ChildrenTable";
import CoachesTable from "./CoachesTable";
import FieldsTable from "./FieldsTable";
import ProgramsContentEditor from "./ProgramsContentEditor";

type Tab = "sessions" | "bookings" | "children" | "coaches" | "fields" | "content";

const TABS: { id: Tab; label: string }[] = [
  { id: "sessions",  label: "אימונים" },
  { id: "bookings",  label: "נרשמים" },
  { id: "children",  label: "ילדים" },
  { id: "coaches",   label: "מאמנים" },
  { id: "fields",    label: "מגרשים" },
  { id: "content",   label: "תוכן האתר" },
];

export default function AdminShell() {
  const [activeTab, setActiveTab] = useState<Tab>("sessions");

  const {
    sessions,
    addSession,
    updateSession,
    deleteSession,
    bookings,
    cancelBooking,
    children,
    addChild,
    editChild,
    deleteChild,
    cardUsage,
    assignCard,
    removeCard,
    cardDevOverrides,
    coaches,
    addCoach,
    updateCoach,
    deleteCoach,
    fields,
    addField,
    updateField,
    deleteField,
    isAdmin,
    isHydrating,
    logout,
  } = useParent();

  const activeBookings = bookings.filter((b) => b.status === "confirmed");

  // ── Auth guard ─────────────────────────────────────────────────────────────
  if (isHydrating) {
    return (
      <div style={{ background: "#070d17", minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ background: "#070d17", minHeight: "100vh" }} className="flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-xl font-black text-white mb-2">אין הרשאה</h1>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            אזור זה מיועד למנהלים בלבד
          </p>
          <Link
            href="/login"
            className="block w-full py-3 rounded-xl font-black text-sm text-center transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07100e" }}
          >
            כניסה
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#070d17", minHeight: "100vh" }}>
      {/* Page header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-12 pb-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block text-xs font-bold tracking-widest uppercase" style={{ color: "#c9a84c" }}>
            Seven Academy
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: "rgba(251,146,60,0.12)", color: "#fdba74", border: "1px solid rgba(251,146,60,0.2)" }}
          >
            ADMIN
          </span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-1">אזור ניהול</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              אזור זה מיועד לניהול האימונים והנרשמים במערכת
            </p>
          </div>
          <button
            onClick={() => { logout(); }}
            className="text-xs font-semibold px-4 py-2 rounded-lg transition-all mt-1"
            style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)", background: "transparent" }}
          >
            יציאה
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "אימונים",          value: sessions.length },
            { label: "ילדים רשומים",      value: children.length },
            { label: "הרשמות פעילות",     value: activeBookings.length },
            { label: "מאמנים",            value: coaches.length },
            { label: "מגרשים",            value: fields.length },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl px-5 py-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-2xl font-black" style={{ color: "#c9a84c" }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-8">
        <div
          className="flex gap-1 p-1 rounded-2xl overflow-x-auto"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={
                  active
                    ? { background: "rgba(201,168,76,0.15)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)" }
                    : { color: "rgba(255,255,255,0.4)", border: "1px solid transparent" }
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
        {activeTab === "sessions" && (
          <SessionsTable
            sessions={sessions}
            bookings={bookings}
            children={children}
            coaches={coaches}
            fields={fields}
            onAdd={addSession}
            onEdit={updateSession}
            onDelete={deleteSession}
            onCancelBooking={cancelBooking}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsTable
            bookings={bookings}
            children={children}
            sessions={sessions}
            onCancel={cancelBooking}
          />
        )}

        {activeTab === "children" && (
          <ChildrenTable
            children={children}
            bookings={bookings}
            cardUsage={cardUsage}
            cardDevOverrides={cardDevOverrides}
            parentName={mockParent.name}
            onAdd={addChild}
            onEdit={editChild}
            onDelete={deleteChild}
            onAssignCard={assignCard}
            onRemoveCard={removeCard}
          />
        )}

        {activeTab === "coaches" && (
          <CoachesTable
            coaches={coaches}
            sessions={sessions}
            onAdd={addCoach}
            onUpdate={updateCoach}
            onDelete={deleteCoach}
          />
        )}

        {activeTab === "fields" && (
          <FieldsTable
            fields={fields}
            sessions={sessions}
            onAdd={addField}
            onUpdate={updateField}
            onDelete={deleteField}
          />
        )}

        {activeTab === "content" && <ProgramsContentEditor />}
      </div>
    </div>
  );
}
