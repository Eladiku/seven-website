import { DAY_INDEX, type TrainingSession } from "@/data/schedule";

const HEB_DAYS = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
  "שבת",
];

const HEB_MONTHS = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

/** Returns the next `count` calendar days starting from today. */
export function getUpcomingDays(count: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

/** Returns sessions that recur on the same weekday as the given date. */
export function getSessionsForDate(sessions: TrainingSession[], date: Date): TrainingSession[] {
  if (!Array.isArray(sessions) || !(date instanceof Date) || isNaN(date.getTime())) return [];
  const dow = date.getDay(); // 0 = Sunday
  return sessions.filter((s) => DAY_INDEX[s.day] === dow);
}

/** True if two Date objects refer to the same calendar day. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** "שלישי, 24 מרץ" */
export function formatHebDate(date: Date): string {
  const dayName = HEB_DAYS[date.getDay()];
  const monthName = HEB_MONTHS[date.getMonth()];
  return `${dayName}, ${date.getDate()} ${monthName}`;
}

/** Short day name for the date pill (first 2-3 chars). */
export function shortHebDay(date: Date): string {
  return HEB_DAYS[date.getDay()].slice(0, 2);
}

/** True if date is today. */
export function isToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isSameDay(date, today);
}

/**
 * Returns "YYYY-MM-DD" using LOCAL date components.
 *
 * DO NOT use d.toISOString().slice(0,10) — that converts to UTC first,
 * which shifts dates backward by one day in timezones east of UTC (e.g. Israel).
 * All Date objects in this app are created at local midnight via setHours(0,0,0,0),
 * so we must extract year/month/day in local time to match booking date strings.
 */
export function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
