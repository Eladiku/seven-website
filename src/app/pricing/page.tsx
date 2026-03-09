import PurchaseModal from "@/components/pricing/PurchaseModal";
import SessionCardVisual from "@/components/pricing/SessionCardVisual";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "כרטיסיית אימון | Seven Academy",
  description:
    "כרטיסיית 10 אימונים – ₪1,600. תקפה עד 24.6.2026, גמישות מלאה. Seven Academy.",
};

export default function PricingPage() {
  return (
    <div style={{ background: "#070d17", color: "#ffffff" }}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="min-h-[88vh] flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        {/* Ambient glow backdrop */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)",
          }}
        />

        <div className="relative max-w-2xl mx-auto">
          {/* Eyebrow badge */}
          <div
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8"
            style={{
              background: "rgba(201,168,76,0.1)",
              color: "#c9a84c",
              border: "1px solid rgba(201,168,76,0.25)",
            }}
          >
            <span
              className="font-black text-sm leading-none"
              style={{ color: "#c9a84c" }}
            >
              7
            </span>
            SEVEN ACADEMY · כרטיסיית האימון
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight text-white mb-6">
            כרטיסיית
            <br />
            <span style={{ color: "#c9a84c" }}>אימונים.</span>
          </h1>

          {/* Price */}
          <div className="flex items-baseline justify-center gap-2 mb-3">
            <span
              className="text-6xl sm:text-7xl font-black leading-none"
              style={{ color: "#c9a84c" }}
            >
              ₪1,600
            </span>
          </div>
          <p className="text-gray-500 text-base mb-10">
            ₪160 לאימון בלבד · תוקף הכרטיסיה: עד 24.6.2026 · גמישות מלאה
          </p>

          {/* CTA */}
          <PurchaseModal />

          {/* Free trial note */}
          <p className="mt-6 text-gray-600 text-sm">
            רוצים לנסות קודם?{" "}
            <a
              href="/contact"
              className="underline underline-offset-2 hover:text-gray-400 transition-colors"
              style={{ color: "#c9a84c" }}
            >
              שיעור ניסיון חינמי לרשומים חדשים
            </a>
          </p>
        </div>
      </section>

      {/* ── Card Preview ─────────────────────────────────── */}
      <section
        className="py-20 px-4"
        style={{ background: "#0a1018" }}
      >
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "#c9a84c" }}
            >
              הכרטיסייה שלכם
            </span>
            <h2 className="text-3xl font-black text-white mt-2">
              כרטיסיית כדורגל קבוצתי
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              10 כניסות טעונות ומוכנות לשימוש
            </p>
          </div>

          {/* Full-fresh card – all 10 active */}
          <div
            className="relative"
            style={{
              filter:
                "drop-shadow(0 24px 48px rgba(201,168,76,0.18)) drop-shadow(0 8px 16px rgba(0,0,0,0.6))",
            }}
          >
            <SessionCardVisual usedCount={0} />
          </div>

          {/* Stat strip below card */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { value: "10", label: "אימונים" },
              { value: "3", label: "חודשי תוקף" },
              { value: "₪160", label: "לאימון" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl py-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="text-2xl font-black leading-tight"
                  style={{ color: "#c9a84c" }}
                >
                  {s.value}
                </div>
                <div className="text-gray-600 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included ──────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: "#070d17" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "#c9a84c" }}
            >
              מה כלול
            </span>
            <h2 className="text-3xl font-black text-white mt-2">
              הכרטיסייה כוללת הכול
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: "⚽",
                title: "גמישות מלאה",
                desc: "בחרו את הימים שנוחים לכם מתוך לוח האימונים השבועי.",
              },
              {
                icon: "📅",
                title: "תוקף הכרטיסיה: עד 24.6.2026",
                desc: "השתמשו ב-10 הכניסות לפני תאריך הסיום.",
              },
              {
                icon: "👟",
                title: "מאמן מוסמך בכל אימון",
                desc: "כל האימונים מונהגים על ידי מאמן מוסמך UEFA.",
              },
              {
                icon: "🔒",
                title: "ללא התחייבות חודשית",
                desc: "משלמים פעם אחת לכרטיסייה. אין מנוי, אין חיובים חוזרים.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: "rgba(201,168,76,0.1)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-white mb-1">{item.title}</div>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Second CTA ───────────────────────────────────── */}
      <section
        className="py-16 px-4 text-center"
        style={{
          background: "#0a1018",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <p className="text-gray-500 text-sm mb-6">
          מוכנים להתחיל? רכשו כרטיסייה ותתחילו לאמן עוד השבוע.
        </p>
        <PurchaseModal />
        <p className="text-gray-700 text-xs mt-4">
          כל המחירים כוללים מע״מ · ללא עלויות נסתרות
        </p>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ background: "#070d17" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "#c9a84c" }}
            >
              שאלות
            </span>
            <h2 className="text-2xl font-black text-white mt-2">
              שאלות נפוצות
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "מה קורה אם הכרטיסייה פגה תוקף?",
                a: "כניסות שלא נוצלו לא ניתנות להחזרה, אך ניתן לבקש הארכה בנסיבות מיוחדות.",
              },
              {
                q: "האם ניתן לשנות קבוצת גיל?",
                a: "הכרטיסייה ניתנת לשימוש בקבוצת הגיל שנרכשה עבורה בלבד. למעבר יש לפנות אלינו.",
              },
              {
                q: "האם יש הנחות לאחים?",
                a: "כן – 10% הנחה על כרטיסייה שנייה לאח/ות מאותה משפחה. צרו קשר לפרטים.",
              },
              {
                q: "האם יש שיעור ניסיון?",
                a: "כן! שיעור ניסיון אחד בחינם לכל שחקן חדש. ציינו זאת בטופס צור קשר.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl px-6 py-5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="font-bold text-white text-sm mb-1.5">
                  {faq.q}
                </div>
                <div className="text-gray-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/contact"
              className="text-sm font-semibold underline underline-offset-4 hover:opacity-70 transition-opacity"
              style={{ color: "#c9a84c" }}
            >
              יש לכם שאלה נוספת? כתבו לנו ←
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
