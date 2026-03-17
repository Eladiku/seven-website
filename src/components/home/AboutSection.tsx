import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AboutSection() {
  return (
    <section className="py-20" style={{ background: "#0a1018" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual block */}
          <div className="relative">
            <div
              className="rounded-2xl p-10 text-white relative overflow-hidden"
              style={{ background: "#0e1520", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Decorative */}
              <div
                className="absolute top-0 left-0 w-48 h-48 rounded-full -translate-x-20 -translate-y-20"
                style={{ background: "rgba(99,102,241,0.08)" }}
              />
              <div
                className="absolute bottom-0 right-0 w-36 h-36 rounded-full translate-x-10 translate-y-10"
                style={{ background: "rgba(99,102,241,0.05)" }}
              />

              <div className="relative">
                <div className="text-8xl font-black mb-4" style={{ color: "#6366f1" }}>7</div>
                <h3 className="text-2xl font-bold mb-3">המספר שמגדיר אותנו</h3>
                <p className="text-gray-400 leading-relaxed">
                  7 שחקנים. 7 ערכים. 7 שנים עד לשחקן בוגר. המספר 7 הוא לא רק שם –
                  הוא הפילוסופיה שלנו.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    "מצוינות טכנית",
                    "חשיבה טקטית",
                    "כושר גופני",
                    "מנטליות מנצחת",
                    "עבודת קבוצה",
                    "ערכים ומשמעת",
                    "אהבה למשחק",
                  ].map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: "#6366f1" }}>{i + 1}.</span>
                      <span className="text-sm text-gray-400">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Text block */}
          <div>
            <SectionHeading
              eyebrow="אודות Seven"
              title="לא רק אימון. התפתחות."
              subtitle="אנחנו מאמינים שכל ילד מגיע עם פוטנציאל. תפקידנו לפתוח אותו – עם מאמנים מקצועיים, שיטות עבודה מוכחות ואווירה שמעוררת השראה."
            />

            <div className="space-y-5">
              {[
                {
                  title: "מאמנים בעלי רישיון UEFA ו-FIFA",
                  desc: "כל המאמנים שלנו עברו הכשרה בינלאומית מוכרת ומביאים ניסיון ממשחק ברמה גבוהה.",
                },
                {
                  title: "גישה פרטנית לכל שחקן",
                  desc: "קבוצות קטנות מאפשרות לנו לתת תשומת לב אישית ולהתאים את האימון לצרכים הספציפיים של כל ילד.",
                },
                {
                  title: "מתקנים מקצועיים",
                  desc: "מגרשי דשא מטופחים, ציוד מקצועי ומרחב אימון בטוח ומכיל.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: "rgba(99,102,241,0.12)" }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: "#6366f1" }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/#programs"
                className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all"
                style={{ color: "#818cf8" }}
              >
                ראה את כל התוכניות
                <span>←</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
