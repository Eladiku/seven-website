import type { Booking } from "@/data/parent";

interface PastSessionsSectionProps {
  bookings: Booking[];
}

export default function PastSessionsSection({ bookings }: PastSessionsSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-black text-white mb-4">עבר אימונים</h2>

      {bookings.length === 0 ? (
        <div
          className="rounded-2xl py-10 text-center"
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
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl px-5 py-3.5 flex items-center justify-between gap-3"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Checkmark */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#86efac" }}
                >
                  ✓
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {booking.title}
                  </div>
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
    </section>
  );
}
