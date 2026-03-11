import { shortHebDay, isToday, isSameDay, getSessionsForDate } from "@/lib/scheduleUtils";
import type { TrainingSession } from "@/data/schedule";

interface DateSelectorProps {
  days: Date[];
  selectedDate: Date;
  sessions: TrainingSession[];
  onSelect: (date: Date) => void;
}

export default function DateSelector({ days, selectedDate, sessions, onSelect }: DateSelectorProps) {
  return (
    <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
      <div className="flex gap-2 pb-1" style={{ width: "max-content" }}>
        {days.map((day) => {
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);
          const hasSessions = getSessionsForDate(sessions, day).length > 0;

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelect(day)}
              className="flex-shrink-0 flex flex-col items-center justify-center rounded-xl transition-all"
              style={{
                width: 52,
                height: 64,
                background: selected
                  ? "linear-gradient(135deg, #c9a84c, #e8c97a)"
                  : "rgba(255,255,255,0.05)",
                border: selected
                  ? "none"
                  : today
                  ? "1px solid rgba(201,168,76,0.45)"
                  : "1px solid rgba(255,255,255,0.08)",
                opacity: !hasSessions && !selected ? 0.4 : 1,
              }}
            >
              {/* Day number */}
              <span
                className="font-black text-xl leading-none"
                style={{ color: selected ? "#07100e" : today ? "#c9a84c" : "#ffffff" }}
              >
                {day.getDate()}
              </span>

              {/* Abbreviated day name */}
              <span
                className="text-[10px] font-semibold mt-1 tracking-wide"
                style={{ color: selected ? "#07100e" : today ? "#c9a84c" : "rgba(255,255,255,0.4)" }}
              >
                {shortHebDay(day)}
              </span>

              {/* Today dot */}
              {today && !selected && (
                <div
                  className="rounded-full mt-1"
                  style={{ width: 4, height: 4, background: "#c9a84c" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
