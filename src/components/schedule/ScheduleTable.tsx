import { schedule, weekDays, ageGroupColors } from "@/data/schedule";

export default function ScheduleTable() {
  return (
    <div>
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-navy text-white">
              {weekDays.map((day) => (
                <th
                  key={day}
                  className="px-4 py-4 font-bold text-center border-l border-navy-700 first:border-l-0"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {weekDays.map((day) => {
                const sessions = schedule.filter((s) => s.day === day);
                return (
                  <td
                    key={day}
                    className="align-top px-3 py-4 border-l border-gray-100 first:border-l-0 bg-white"
                    style={{ minWidth: 160 }}
                  >
                    <div className="space-y-3">
                      {sessions.length === 0 ? (
                        <p className="text-gray-300 text-xs text-center py-4">אין אימונים</p>
                      ) : (
                        sessions.map((session) => (
                          <div
                            key={session.id}
                            className="rounded-xl p-3 border border-gray-100 hover:border-green/30 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-full ${ageGroupColors[session.ageGroup]}`}
                              >
                                {session.ageGroup}
                              </span>
                              <span className="text-xs text-muted font-mono">
                                {session.time}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-navy leading-tight mb-1">
                              {session.title}
                            </p>
                            <p className="text-xs text-muted">
                              {session.location} · {session.coach}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-6">
        {weekDays.map((day) => {
          const sessions = schedule.filter((s) => s.day === day);
          if (sessions.length === 0) return null;
          return (
            <div key={day}>
              <h3 className="text-navy font-bold mb-3 text-lg border-b border-gray-100 pb-2">
                {day}
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
    </div>
  );
}
