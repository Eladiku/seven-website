import { schedule, type TrainingSession } from "@/data/schedule";

/** Returns sessions that match the given birth year. */
export function filterSessionsByBirthYear(
  sessions: TrainingSession[],
  birthYear: string
): TrainingSession[] {
  return sessions.filter((s) => s.birthYear === birthYear);
}

/** All unique birth years present in the schedule, sorted newest first. */
export function getUniqueBirthYears(): string[] {
  return [...new Set(schedule.map((s) => s.birthYear))].sort((a, b) =>
    b.localeCompare(a)
  );
}
