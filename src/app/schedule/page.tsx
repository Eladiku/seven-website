import ScheduleFeed from "@/components/schedule/ScheduleFeed";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "לוח אימונים | Seven Academy",
  description: "לוח אימונים שבועי של אקדמיית Seven לכדורגל נוער.",
};

export default function SchedulePage() {
  return (
    <div style={{ background: "#070d17", minHeight: "100vh" }}>
      {/* Page header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-12 pb-8 max-w-2xl mx-auto">
        <span
          className="inline-block text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: "#c9a84c" }}
        >
          לוח אימונים
        </span>
        <h1 className="text-4xl font-black text-white mb-2">אימונים קרובים</h1>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
          בחר תאריך לצפייה באימונים הזמינים ואישור הגעה.
        </p>
      </div>

      {/* Feed */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto pb-16">
        <ScheduleFeed />
      </div>

      {/* Info strip */}
      <div
        className="border-t px-4 sm:px-6 lg:px-8 py-10"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "📍",
              title: "מיקום",
              desc: "רחוב הספורט 7, תל אביב",
            },
            {
              icon: "👟",
              title: "מה להביא",
              desc: "נעלי כדורגל, בקבוק מים. הכדור מסופק.",
            },
            {
              icon: "⏰",
              title: "הגעה מוקדמת",
              desc: "מומלץ להגיע 10 דקות לפני.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl px-5 py-4 flex gap-3 items-start"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-white font-bold text-sm">{item.title}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="px-4 py-12 text-center border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
          עדיין אין לכם כרטיסייה?
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
            color: "#07100e",
          }}
        >
          רכוש כרטיסיית 10 אימונים
        </Link>
      </div>
    </div>
  );
}
