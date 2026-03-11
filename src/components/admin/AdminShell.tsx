"use client";

import { useParent } from "@/context/ParentContext";
import SessionsTable from "./SessionsTable";
import BookingsTable from "./BookingsTable";

export default function AdminShell() {
  const {
    sessions,
    addSession,
    updateSession,
    deleteSession,
    bookings,
    cancelBooking,
    children,
  } = useParent();

  return (
    <div style={{ background: "#070d17", minHeight: "100vh" }}>
      {/* Page header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-12 pb-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase"
            style={{ color: "#c9a84c" }}
          >
            Seven Academy
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{
              background: "rgba(251,146,60,0.12)",
              color: "#fdba74",
              border: "1px solid rgba(251,146,60,0.2)",
            }}
          >
            ADMIN
          </span>
        </div>
        <h1 className="text-4xl font-black text-white mb-2">אזור ניהול</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          אזור זה מיועד לניהול האימונים והנרשמים במערכת
        </p>
      </div>

      {/* Stats bar */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "אימונים", value: sessions.length },
            { label: "ילדים רשומים", value: children.length },
            { label: "הרשמות פעילות", value: bookings.filter((b) => b.status === "confirmed").length },
            { label: "סה״כ הרשמות", value: bookings.length },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl px-5 py-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="text-2xl font-black" style={{ color: "#c9a84c" }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16 space-y-14">
        {/* Section 1: Sessions */}
        <SessionsTable
          sessions={sessions}
          bookings={bookings}
          onAdd={addSession}
          onEdit={updateSession}
          onDelete={deleteSession}
        />

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* Section 2: Bookings */}
        <BookingsTable
          bookings={bookings}
          children={children}
          onCancel={cancelBooking}
        />
      </div>
    </div>
  );
}
