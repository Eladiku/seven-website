"use client";

import { useState, useMemo } from "react";
import { useParent } from "@/context/ParentContext";
import { getUpcomingDays, getSessionsForDate } from "@/lib/scheduleUtils";
import { filterSessionsByBirthYear } from "@/lib/childUtils";
import DateSelector from "./DateSelector";
import DaySection from "./DaySection";
import ChildSelector from "./ChildSelector";
import type { CardStatus } from "./SessionCard";

const UPCOMING_DAYS = 10;

export default function ScheduleFeed() {
  const days = useMemo(() => getUpcomingDays(UPCOMING_DAYS), []);

  // ── All state from the single shared context ──────────────────────────────
  const {
    children,
    selectedChildId,
    setSelectedChildId,
    selectedChild,
    bookings,
    cardUsage,
    sessions,
    cardDevOverrides,
    toggleAttendance,
  } = useParent();

  // Birth years derived from live Supabase sessions (not static hardcoded data)
  const birthYears = useMemo(
    () =>
      [...new Set(sessions.map((s) => s.birthYear).filter(Boolean))].sort((a, b) =>
        b.localeCompare(a)
      ),
    [sessions]
  );

  // ── Card eligibility ──────────────────────────────────────────────────────
  // usedSessions is derived from ALL bookings for the child (same logic as
  // MyCardSection) so the two views are always in sync.
  const selectedCard = useMemo(
    () => (selectedChild ? (cardUsage.find((c) => c.childId === selectedChild.id) ?? null) : null),
    [cardUsage, selectedChild]
  );

  const allChildBookings = useMemo(
    () => (selectedChild ? bookings.filter((b) => b.childId === selectedChild.id) : []),
    [bookings, selectedChild]
  );

  const cardStatus: CardStatus = useMemo(() => {
    if (!selectedChild) return "ok"; // no child selected → no restriction (guest view)
    if (!selectedCard) return "none";
    // Expiry check: expiresAt is "D.M.YYYY"
    const [d, m, y] = selectedCard.expiresAt.split(".").map(Number);
    if (new Date(y, m - 1, d) < new Date()) return "none";
    // Dev override takes precedence over booking-derived count
    const used =
      selectedChild.id in cardDevOverrides
        ? cardDevOverrides[selectedChild.id]
        : allChildBookings.length;
    const remaining = Math.max(0, selectedCard.totalSessions - used);
    return remaining > 0 ? "ok" : "no_remaining";
  }, [selectedChild, selectedCard, allChildBookings, cardDevOverrides]);

  // Fallback birth year selector (only shown when no children exist).
  // Intentionally starts empty — user must pick a year when no child is assigned.
  const [manualBirthYear, setManualBirthYear] = useState<string>("");
  const activeBirthYear = selectedChild ? selectedChild.birthYear : manualBirthYear;

  // ── Date selection ────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<Date>(days[0]);
  // ── Optimistic spot counts ────────────────────────────────────────────────
  const [localSpots, setLocalSpots] = useState<Record<string, number>>(
    () => Object.fromEntries(sessions.map((s) => [s.id, s.spotsFilled]))
  );

  // ── Attending: confirmed bookings for this child for sessions on this date ─
  const attendingSessionIds = useMemo(() => {
    if (!selectedChild) return new Set<string>();
    const sessionIdsForDate = new Set(
      getSessionsForDate(sessions, selectedDate).map((s) => s.id)
    );
    return new Set(
      bookings
        .filter(
          (b) =>
            b.childId === selectedChild.id &&
            sessionIdsForDate.has(b.sessionId) &&
            b.status === "confirmed"
        )
        .map((b) => b.sessionId)
    );
  }, [bookings, selectedChild, selectedDate, sessions]);

  // ── Sessions to display ───────────────────────────────────────────────────
  // Rule: show sessions that match child's birthYear OR are booked for this child.
  // This ensures booked sessions always appear even after a birth year edit.
  const { sessionsToShow, mismatchedIds } = useMemo(() => {
    const allForDay = getSessionsForDate(sessions, selectedDate);

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
  }, [selectedDate, activeBirthYear, attendingSessionIds, sessions]);

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
    // Block new bookings when the card is invalid; canceling is always allowed.
    if (isNowAttending && cardStatus !== "ok") return;
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    toggleAttendance(selectedChild.id, session);

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

      {/* Helper text — hidden when no year is selected yet */}
      {activeBirthYear && (
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
      )}

      {!activeBirthYear ? (
        /* No child and no year selected — prompt user to pick */
        <div
          className="mb-8 rounded-2xl px-5 py-6 text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>
            בחר שנתון כדי לראות את האימונים הרלוונטיים
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            השתמש בסינון למעלה כדי לבחור שנתון
          </p>
        </div>
      ) : (
        <>
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
              sessions={sessions}
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
            cardStatus={cardStatus}
            onToggle={handleToggle}
          />
        </>
      )}

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
