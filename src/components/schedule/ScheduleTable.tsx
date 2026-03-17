import { schedule, ageGroupColors } from "@/data/schedule";
import { formatHebDate } from "@/lib/scheduleUtils";

// Group sessions by date for display
const sessionsByDate = schedule.reduce<Record<string, typeof schedule>>((acc, s) => {
  (acc[s.date] ??= []).push(s);
  return acc;
}, {});

const sortedDates = Object.keys(sessionsByDate).sort();

export default function ScheduleTable() {
  return (
    <div className="space-y-8">
      {sortedDates.map((date) => {
        const sessions = sessionsByDate[date];
        const dateLabel = formatHebDate(new Date(date + "T00:00:00"));
        return (
          <div key={date}>
            <h3 className="text-navy font-bold mb-3 text-lg border-b border-gray-100 pb-2">
              {dateLabel}
            </h3>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${ageGroupColors[session.ageGroup]}`}
                    >
                      {session.ageGroup}
                    </span>
                    <span className="text-sm font-mono text-muted font-semibold">
                      {session.time}
                    </span>
                  </div>
                  <p className="font-semibold text-navy text-sm mb-1">{session.title}</p>
                  <p className="text-xs text-muted">
                    {session.location} · {session.coach}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
