import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "#070d17" }}>
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10%",
          right: "15%",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "0",
          left: "5%",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Large background number */}
      <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden">
        <span
          className="text-[32rem] font-black text-white leading-none"
          style={{ opacity: 0.025 }}
        >
          7
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40">
        <div className="max-w-2xl">
          <span
            className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-6 tracking-widest uppercase"
            style={{
              background: "rgba(99,102,241,0.12)",
              color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.25)",
            }}
          >
            אקדמיית כדורגל לגילאי 8–17
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
            פתח את
            <br />
            <span style={{ color: "#6366f1" }}>הפוטנציאל</span>
            <br />
            שלך
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-lg">
            אצלנו ב-Seven, כל שחקן מקבל אימון מקצועי, תשומת לב אישית ודרך
            ברורה להתפתח. מגיל 8 ועד 17 – זה המקום לצמוח.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/#programs"
              className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-base rounded-xl transition-all hover:opacity-90"
              style={{ background: "#6366f1", color: "#fff" }}
            >
              גלה את התוכניות
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-3.5 font-semibold text-base rounded-xl transition-all hover:text-white"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              צור קשר
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="relative"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "4", label: "קבוצות גיל" },
              { value: "+200", label: "שחקנים" },
              { value: "6", label: "מאמנים מוסמכים" },
              { value: "5", label: "שנות ניסיון" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-black text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
