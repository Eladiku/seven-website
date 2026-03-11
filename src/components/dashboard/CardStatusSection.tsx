import type { Child, TrainingCard } from "@/data/parent";

interface CardStatusSectionProps {
  child: Child | null;
  card: TrainingCard | null;
}

export default function CardStatusSection({ child, card }: CardStatusSectionProps) {
  if (!child) {
    return (
      <section>
        <h2 className="text-lg font-black text-white mb-4">מצב כרטיסייה</h2>
        <div
          className="rounded-2xl py-10 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
            בחר ילד/ה לצפייה בכרטיסייה
          </p>
        </div>
      </section>
    );
  }

  if (!card) {
    return (
      <section>
        <h2 className="text-lg font-black text-white mb-4">מצב כרטיסייה</h2>
        <div
          className="rounded-2xl py-10 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="text-3xl mb-2">🎫</div>
          <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
            אין כרטיסייה פעילה עבור {child.name}
          </p>
        </div>
      </section>
    );
  }

  const remaining = card.totalSessions - card.usedSessions;
  const fillPct = Math.round((card.usedSessions / card.totalSessions) * 100);
  const isLow = remaining <= 2;

  return (
    <section>
      <h2 className="text-lg font-black text-white mb-4">מצב כרטיסייה</h2>

      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Child name + birth year */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-white font-bold text-base">{child.name}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(201,168,76,0.7)" }}>
              שנתון {child.birthYear}
            </div>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{
              background: "rgba(201,168,76,0.12)",
              color: "#c9a84c",
              border: "1px solid rgba(201,168,76,0.25)",
            }}
          >
            {card.type}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "סה״כ", value: card.totalSessions },
            { label: "נוצלו", value: card.usedSessions },
            { label: "נותרו", value: remaining },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl px-3 py-3 text-center"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="text-2xl font-black leading-none mb-1"
                style={{
                  color:
                    label === "נותרו"
                      ? isLow
                        ? "#fca5a5"
                        : "#c9a84c"
                      : "rgba(255,255,255,0.75)",
                }}
              >
                {value}
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Dot progress — 10 circles */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {Array.from({ length: card.totalSessions }).map((_, i) => {
              const filled = i < card.usedSessions;
              return (
                <div
                  key={i}
                  className="rounded-full transition-all"
                  style={{
                    width: 26,
                    height: 26,
                    background: filled
                      ? "linear-gradient(135deg, #c9a84c, #e8c97a)"
                      : "rgba(255,255,255,0.08)",
                    border: filled
                      ? "none"
                      : "1px solid rgba(255,255,255,0.12)",
                    boxShadow: filled ? "0 2px 8px rgba(201,168,76,0.3)" : "none",
                  }}
                />
              );
            })}
          </div>
          <div className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {fillPct}% נוצל
          </div>
        </div>

        {/* Expiry */}
        <div
          className="flex items-center justify-between rounded-xl px-4 py-2.5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>
            תוקף כרטיסייה
          </span>
          <span className="text-sm font-bold" style={{ color: isLow ? "#fca5a5" : "rgba(255,255,255,0.65)" }}>
            {card.expiresAt}
          </span>
        </div>

        {isLow && (
          <div
            className="mt-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-center"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#fca5a5",
            }}
          >
            נותרו {remaining} אימונים בלבד — מומלץ לחדש כרטיסייה
          </div>
        )}
      </div>
    </section>
  );
}
