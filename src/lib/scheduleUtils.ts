import { schedule, DAY_INDEX, type TrainingSession } from "@/data/schedule";

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
export function getSessionsForDate(date: Date): TrainingSession[] {
  const dow = date.getDay(); // 0 = Sunday
  return schedule.filter((s) => DAY_INDEX[s.day] === dow);
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
