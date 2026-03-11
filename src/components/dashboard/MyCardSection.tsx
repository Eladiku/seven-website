import type { Child, TrainingCard, Booking } from "@/data/parent";

interface MyCardSectionProps {
  child: Child | null;
  card: TrainingCard | null;
  upcomingBookings: Booking[];
  pastBookings: Booking[];
  onCancel: (id: string) => void;
}

export default function MyCardSection({
  child,
  card,
  upcomingBookings,
  pastBookings,
  onCancel,
}: MyCardSectionProps) {
  // ── Derive usedSessions from live bookings ─────────────────────────────────
  // Every active booking (upcoming confirmed + past completed) counts as one
  // used session. Canceling a booking automatically returns it to the balance.
  const usedSessions = upcomingBookings.length + pastBookings.length;
  const remaining = card ? Math.max(0, card.totalSessions - usedSessions) : 0;
  const isLow = card !== null && remaining <= 2;

  // ── No child selected ──────────────────────────────────────────────────────
  if (!child) {
    return (
      <section>
        <h2 className="text-lg font-black text-white mb-4">הכרטיסייה שלי</h2>
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

  return (
    <section>
      <h2 className="text-lg font-black text-white mb-4">הכרטיסייה שלי</h2>

      {/* ── Card details block ──────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Child name + type badge */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-white font-bold text-base">{child.name}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(201,168,76,0.7)" }}>
              שנתון {child.birthYear}
            </div>
          </div>
          {card ? (
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
          ) : (
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              אין כרטיסייה
            </span>
          )}
        </div>

        {card ? (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "סה״כ", value: card.totalSessions },
                { label: "נוצלו", value: usedSessions },
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

            {/* Dot progress */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                {Array.from({ length: card.totalSessions }).map((_, i) => {
                  const filled = i < usedSessions;
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
                        border: filled ? "none" : "1px solid rgba(255,255,255,0.12)",
                        boxShadow: filled ? "0 2px 8px rgba(201,168,76,0.3)" : "none",
                      }}
                    />
                  );
                })}
              </div>
              {usedSessions === 0 ? (
                <div className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                  עדיין לא נוצלו אימונים מהכרטיסייה
                </div>
              ) : (
                <div className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {Math.round((usedSessions / card.totalSessions) * 100)}% נוצל
                </div>
              )}
            </div>

            {/* Expiry */}
            <div
              className="flex items-center justify-between rounded-xl px-4 py-2.5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>
                תוקף כרטיסייה
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: isLow ? "#fca5a5" : "rgba(255,255,255,0.65)" }}
              >
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
          </>
        ) : (
          <div
            className="rounded-xl py-8 text-center"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="text-3xl mb-2">🎫</div>
            <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
              אין כרטיסייה פעילה עבור {child.name}
            </p>
          </div>
        )}
      </div>

      {/* ── Upcoming sessions ───────────────────────────────────────────────── */}
      <div className="mb-6">
        <h3
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          אימונים קרובים
        </h3>

        {upcomingBookings.length === 0 ? (
          <div
            className="rounded-2xl py-8 text-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="text-2xl mb-2">⚽</div>
            <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
              אין אימונים קרובים מאושרים
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold mb-1" style={{ color: "#c9a84c" }}>
                      {booking.dayLabel}
                    </div>
                    <div
                      className="font-black text-2xl leading-none mb-2"
                      style={{ color: "rgba(255,255,255,0.9)", fontVariantNumeric: "tabular-nums" }}
                    >
                      {booking.time}
                    </div>
                    <div className="text-white font-bold text-sm mb-0.5">{booking.title}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                      📍 {booking.location}&nbsp;&nbsp;·&nbsp;&nbsp;{booking.coach}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{
                        background: "rgba(34,197,94,0.12)",
                        color: "#86efac",
                        border: "1px solid rgba(34,197,94,0.2)",
                      }}
                    >
                      מאושר ✓
                    </span>
                    <button
                      onClick={() => onCancel(booking.id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        color: "rgba(252,165,165,0.7)",
                        border: "1px solid rgba(239,68,68,0.15)",
                      }}
                    >
                      ביטול הגעה
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Past sessions ───────────────────────────────────────────────────── */}
      <div>
        <h3
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          היסטוריית אימונים
        </h3>

        {pastBookings.length === 0 ? (
          <div
            className="rounded-2xl py-8 text-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
              אין אימונים שהושלמו עדיין
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pastBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl px-5 py-3.5 flex items-center justify-between gap-3"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ background: "rgba(34,197,94,0.1)", color: "#86efac" }}
                  >
                    ✓
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{booking.title}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {booking.dayLabel}&nbsp;&nbsp;·&nbsp;&nbsp;{booking.time}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 text-end">
                  <div className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
                    📍 {booking.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
