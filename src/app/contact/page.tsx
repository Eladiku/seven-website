import SectionHeading from "@/components/ui/SectionHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "צור קשר | Seven Academy",
  description: "צרו קשר עם אקדמיית Seven לכדורגל נוער. נשמח לענות על כל שאלה.",
};

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-sm font-semibold tracking-widest text-green uppercase mb-3">
            צור קשר
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            נשמח לשמוע מכם
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            שאלות על התוכניות, לוח האימונים או הרשמה? השאירו פרטים ונחזור אליכם
            תוך יום עסקים.
          </p>
        </div>
      </div>

      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <SectionHeading
                  eyebrow="טופס פנייה"
                  title="שלחו לנו הודעה"
                />
                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="parentName"
                        className="block text-sm font-semibold text-navy mb-1.5"
                      >
                        שם ההורה
                      </label>
                      <input
                        id="parentName"
                        type="text"
                        placeholder="ישראל ישראלי"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="childName"
                        className="block text-sm font-semibold text-navy mb-1.5"
                      >
                        שם הילד/ה
                      </label>
                      <input
                        id="childName"
                        type="text"
                        placeholder="שם הילד/ה"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-navy mb-1.5"
                      >
                        טלפון
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="050-000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green transition-colors text-sm"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-navy mb-1.5"
                      >
                        אימייל
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green transition-colors text-sm"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="ageGroup"
                      className="block text-sm font-semibold text-navy mb-1.5"
                    >
                      קבוצת גיל מבוקשת
                    </label>
                    <select
                      id="ageGroup"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green transition-colors text-sm bg-white"
                    >
                      <option value="">בחרו קבוצת גיל...</option>
                      <option value="u9">U9 – גילאי 8–9</option>
                      <option value="u12">U12 – גילאי 10–12</option>
                      <option value="u15">U15 – גילאי 13–15</option>
                      <option value="u17">U17 – גילאי 16–17</option>
                      <option value="unknown">לא יודע/ת</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-navy mb-1.5"
                    >
                      הודעה (אופציונלי)
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="שאלות, בקשות מיוחדות, מידע נוסף..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green transition-colors text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-green text-navy font-bold text-base rounded-xl hover:bg-green-600 transition-colors shadow-sm"
                  >
                    שלח פנייה
                  </button>

                  <p className="text-xs text-muted text-center">
                    נחזור אליכם תוך יום עסקים אחד.
                  </p>
                </form>
              </div>
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-navy rounded-2xl p-7 text-white">
                <h3 className="font-bold text-lg mb-5">פרטי התקשרות</h3>
                <div className="space-y-4">
                  {[
                    { icon: "📍", label: "כתובת", value: "רחוב הספורט 7, תל אביב" },
                    { icon: "📞", label: "טלפון", value: "050-000-0000" },
                    { icon: "✉️", label: "אימייל", value: "info@seven-academy.co.il" },
                    { icon: "⏰", label: "שעות פעילות", value: "א׳–ה׳: 15:30–21:00\nו׳: 08:00–12:00" },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-3">
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <div className="text-xs text-gray-400 mb-0.5">
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-200 whitespace-pre-line">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green/10 border border-green/20 rounded-2xl p-7">
                <h3 className="font-bold text-navy mb-2">שיעור ניסיון בחינם</h3>
                <p className="text-muted text-sm leading-relaxed mb-4">
                  מציעים לכל שחקן חדש שיעור ניסיון אחד ללא עלות, כדי שתוכלו
                  להרגיש את האווירה ולראות שזה מתאים.
                </p>
                <span className="inline-flex items-center gap-1 text-green text-sm font-semibold">
                  ציינו זאת בהודעה ←
                </span>
              </div>

              <div className="bg-white rounded-2xl p-7 border border-gray-100">
                <h3 className="font-bold text-navy mb-3">שאלות נפוצות</h3>
                <ul className="space-y-2">
                  {[
                    "מה גיל הכניסה המינימלי?",
                    "האם יש קבוצות לבנות?",
                    "איך מגיעים למגרש?",
                  ].map((q) => (
                    <li key={q} className="text-sm text-muted hover:text-navy transition-colors cursor-pointer flex items-center gap-1.5">
                      <span className="text-green text-xs">←</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
