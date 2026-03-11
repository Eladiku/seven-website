"use client";

import { useState, useMemo } from "react";
import { schedule } from "@/data/schedule";
import { useParent } from "@/context/ParentContext";
import { getUpcomingDays, getSessionsForDate, formatHebDate, toLocalISODate } from "@/lib/scheduleUtils";
import { filterSessionsByBirthYear, getUniqueBirthYears } from "@/lib/childUtils";
import DateSelector from "./DateSelector";
import DaySection from "./DaySection";
import ChildSelector from "./ChildSelector";

const UPCOMING_DAYS = 10;

export default function ScheduleFeed() {
  const days = useMemo(() => getUpcomingDays(UPCOMING_DAYS), []);
  const birthYears = useMemo(() => getUniqueBirthYears(), []);

  // ── All state from the single shared context ──────────────────────────────
  const {
    children,
    selectedChildId,
    setSelectedChildId,
    selectedChild,
    bookings,
    toggleAttendance,
  } = useParent();

  const hasChildren = children.length > 0;

  // Fallback birth year selector (only shown when no children exist)
  const [manualBirthYear, setManualBirthYear] = useState<string>(birthYears[0] ?? "");
  const activeBirthYear = selectedChild ? selectedChild.birthYear : manualBirthYear;

  // ── Date selection ────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<Date>(days[0]);
  const selectedDateISO = toLocalISODate(selectedDate);

  // ── Optimistic spot counts ────────────────────────────────────────────────
  const [localSpots, setLocalSpots] = useState<Record<string, number>>(
    () => Object.fromEntries(schedule.map((s) => [s.id, s.spotsFilled]))
  );

  // ── Attending: confirmed bookings for this child on this date ─────────────
  const attendingSessionIds = useMemo(() => {
    if (!selectedChild) return new Set<string>();
    return new Set(
      bookings
        .filter(
          (b) =>
            b.childId === selectedChild.id &&
            b.date === selectedDateISO &&
            b.status === "confirmed"
        )
        .map((b) => b.sessionId)
    );
  }, [bookings, selectedChild, selectedDateISO]);

  // ── Sessions to display ───────────────────────────────────────────────────
  // Rule: show sessions that match child's birthYear OR are booked for this child.
  // This ensures booked sessions always appear even after a birth year edit.
  const { sessionsToShow, mismatchedIds } = useMemo(() => {
    const allForDay = getSessionsForDate(selectedDate);

    // Sessions matching current birth year
    const byBirthYear = new Set(
      filterSessionsByBirthYear(allForDay, activeBirthYear).map((s) => s.id)
    );

    // Sessions booked for this child on this day (regardless of birth year)
    const booked = attendingSessionIds; // already filtered by child + date

    // Union: include session if it matches birth year OR is booked
    const toShow = allForDay.filter(
      (s) => byBirthYear.has(s.id) || booked.has(s.id)
    );

    // Mismatched = booked but does NOT match current birth year
    const mismatched = new Set(
      toShow
        .filter((s) => booked.has(s.id) && !byBirthYear.has(s.id))
        .map((s) => s.id)
    );

    return { sessionsToShow: toShow, mismatchedIds: mismatched };
  }, [selectedDate, activeBirthYear, attendingSessionIds]);

  // ── Total confirmed bookings for the summary badge ────────────────────────
  const totalConfirmed = useMemo(() => {
    if (!selectedChild) return 0;
    return bookings.filter(
      (b) => b.childId === selectedChild.id && b.status === "confirmed"
    ).length;
  }, [bookings, selectedChild]);

  // ── Toggle attendance ─────────────────────────────────────────────────────
  function handleToggle(sessionId: string) {
    if (!selectedChild) return;
    const isNowAttending = !attendingSessionIds.has(sessionId);
    const session = schedule.find((s) => s.id === sessionId);
    if (!session) return;

    toggleAttendance(
      selectedChild.id,
      session,
      selectedDateISO,
      formatHebDate(selectedDate)
    );

    setLocalSpots((prev) => ({
      ...prev,
      [sessionId]: isNowAttending ? prev[sessionId] + 1 : prev[sessionId] - 1,
    }));
  }

  return (
    <div>
      {/* Child selector */}
      <ChildSelector
        children={children}
        selectedChildId={selectedChildId}
        onSelectChild={setSelectedChildId}
        birthYears={birthYears}
        selectedBirthYear={manualBirthYear}
        onSelectBirthYear={setManualBirthYear}
      />

      {/* Helper text */}
      <div
        className="mb-6 text-xs rounded-xl px-4 py-2.5 inline-block"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        מציגים אימונים עבור:{" "}
        <span style={{ color: "rgba(255,255,255,0.75)" }}>
          {selectedChild ? selectedChild.name : `שנתון ${activeBirthYear}`}
        </span>
        {" | "}
        <span style={{ color: "rgba(201,168,76,0.8)" }}>שנתון {activeBirthYear}</span>
      </div>

      {/* Date selector */}
      <div className="mb-8">
        <p
          className="text-xs font-semibold mb-3 tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          בחר תאריך
        </p>
        <DateSelector
          days={days}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />
      </div>

      {/* Session feed */}
      <DaySection
        date={selectedDate}
        sessions={sessionsToShow}
        attending={attendingSessionIds}
        mismatchedIds={mismatchedIds}
        localSpots={localSpots}
        onToggle={handleToggle}
      />

      {/* Summary badge */}
      {totalConfirmed > 0 && (
        <div
          className="mt-8 rounded-2xl px-5 py-4 flex items-center justify-between"
          style={{
            background: "rgba(201,168,76,0.08)",
            border: "1px solid rgba(201,168,76,0.25)",
          }}
        >
          <div>
            <div className="text-white font-bold text-sm">
              {totalConfirmed} אימון{totalConfirmed > 1 ? "ים" : ""} אושרו
            </div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              תזכורת תשלח יום לפני כל אימון
            </div>
          </div>
          <div className="text-2xl font-black leading-none" style={{ color: "#c9a84c" }}>
            ✓
          </div>
        </div>
      )}
    </div>
  );
}
