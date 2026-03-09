import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual block */}
          <div className="relative">
            <div className="bg-navy rounded-2xl p-10 text-white relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-green/10 rounded-full -translate-x-20 -translate-y-20" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-green/5 rounded-full translate-x-10 translate-y-10" />

              <div className="relative">
                <div className="text-8xl font-black text-green mb-4">7</div>
                <h3 className="text-2xl font-bold mb-3">המספר שמגדיר אותנו</h3>
                <p className="text-gray-300 leading-relaxed">
                  7 שחקנים. 7 ערכים. 7 שנים עד לשחקן בוגר. המספר 7 הוא לא רק שם –
                  הוא הפילוסופיה שלנו.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
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
                      <span className="text-green text-sm font-bold">{i + 1}.</span>
                      <span className="text-sm text-gray-300">{value}</span>
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
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">{item.title}</h4>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 text-green font-semibold hover:gap-3 transition-all"
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
