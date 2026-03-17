import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-navy overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #00c853 0,
              #00c853 1px,
              transparent 0,
              transparent 50%
            )`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Large background number */}
      <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden">
        <span
          className="text-[28rem] font-black text-white leading-none"
          style={{ opacity: 0.03 }}
        >
          7
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div className="max-w-2xl">
          <span className="inline-block bg-green/10 text-green text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-green/20">
            אקדמיית כדורגל לגילאי 8–17
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            פתח את
            <br />
            <span className="text-green">הפוטנציאל</span>
            <br />
            שלך
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
            אצלנו ב-Seven, כל שחקן מקבל אימון מקצועי, תשומת לב אישית ודרך
            ברורה להתפתח. מגיל 8 ועד 17 – זה המקום לצמוח.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/#programs"
              className="inline-flex items-center justify-center px-8 py-4 bg-green text-navy font-bold text-lg rounded-xl hover:bg-green-600 transition-colors shadow-lg"
            >
              גלה את התוכניות
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-xl hover:border-green hover:text-green transition-colors"
            >
              צור קשר
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative border-t border-navy-700 bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "4", label: "קבוצות גיל" },
              { value: "+200", label: "שחקנים" },
              { value: "6", label: "מאמנים מוסמכים" },
              { value: "5", label: "שנות ניסיון" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-black text-green">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
