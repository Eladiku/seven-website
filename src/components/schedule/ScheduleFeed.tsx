"use client";

import { useState, useMemo } from "react";
import { schedule } from "@/data/schedule";
import { getUpcomingDays, getSessionsForDate, isSameDay } from "@/lib/scheduleUtils";
import DateSelector from "./DateSelector";
import DaySection from "./DaySection";

const UPCOMING_DAYS = 10;

export default function ScheduleFeed() {
  const days = useMemo(() => getUpcomingDays(UPCOMING_DAYS), []);

  const [selectedDate, setSelectedDate] = useState<Date>(days[0]);

  // Optimistic spot counts per session id
  const [localSpots, setLocalSpots] = useState<Record<string, number>>(
    () => Object.fromEntries(schedule.map((s) => [s.id, s.spotsFilled]))
  );

  // Set of session IDs the user confirmed attendance for
  const [attending, setAttending] = useState<Set<string>>(new Set());

  function handleToggle(id: string) {
    const isNowAttending = !attending.has(id);
    setAttending((prev) => {
      const next = new Set(prev);
      isNowAttending ? next.add(id) : next.delete(id);
      return next;
    });
    setLocalSpots((prev) => ({
      ...prev,
      [id]: isNowAttending ? prev[id] + 1 : prev[id] - 1,
    }));
  }

  const sessionsForSelectedDay = getSessionsForDate(selectedDate);

  // Find the closest day with sessions to pre-select (used only for initial render)
  const selectedDayHasSessions = sessionsForSelectedDay.length > 0;

  return (
    <div>
      {/* Date selector */}
      <div className="mb-8">
        <p className="text-xs font-semibold mb-3 tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.3)" }}>
          בחר תאריך
        </p>
        <DateSelector
          days={days}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />
      </div>

      {/* Session feed for selected date */}
      <DaySection
        date={selectedDate}
        sessions={sessionsForSelectedDay}
        attending={attending}
        localSpots={localSpots}
        onToggle={handleToggle}
      />

      {/* Attending summary — shown when user has RSVPs */}
      {attending.size > 0 && (
        <div
          className="mt-8 rounded-2xl px-5 py-4 flex items-center justify-between"
          style={{
            background: "rgba(201,168,76,0.08)",
            border: "1px solid rgba(201,168,76,0.25)",
          }}
        >
          <div>
            <div className="text-white font-bold text-sm">
              {attending.size} אימון{attending.size > 1 ? "ים" : ""} אושרו
            </div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              תזכורת תשלח יום לפני כל אימון
            </div>
          </div>
          <div
            className="text-2xl font-black leading-none"
            style={{ color: "#c9a84c" }}
          >
            ✓
          </div>
        </div>
      )}
    </div>
  );
}
