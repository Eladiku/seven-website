import SectionHeading from "@/components/ui/SectionHeading";

const values = [
  {
    icon: "⚽",
    title: "מצוינות טכנית",
    description:
      "שיטות אימון מבוססות על מחקר ועל הדרך שבה מועדונים מובילים בעולם מפתחים שחקנים.",
  },
  {
    icon: "🧠",
    title: "חשיבה טקטית",
    description:
      "שחקן חכם מנצח שחקן חזק. אנחנו מלמדים לקרוא את המשחק ולקבל החלטות נכונות בלחץ.",
  },
  {
    icon: "💪",
    title: "פיתוח גופני",
    description:
      "תוכניות כושר מותאמות לגיל, שמחזקות את הגוף בצורה בטוחה וממקסמות ביצועים.",
  },
  {
    icon: "🤝",
    title: "ערכי קבוצה",
    description:
      "כדורגל הוא ספורט קבוצתי. אנחנו מטפחים שיתוף פעולה, כבוד הדדי ואחריות.",
  },
  {
    icon: "🎯",
    title: "מטרות ברורות",
    description:
      "כל שחקן מקבל תוכנית התפתחות אישית עם יעדים מדידים ומסלול ברור לשיפור.",
  },
  {
    icon: "❤️",
    title: "אהבה למשחק",
    description:
      "לפני הכול, כדורגל צריך להיות כיף. אנחנו שומרים על ניצוץ האהבה שבכל שחקן.",
  },
];

export default function ValuesSection() {
  return (
    <section className="py-20" style={{ background: "#070d17" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="הערכים שלנו"
          title="מה מייחד את Seven"
          subtitle="שישה עמודי תווך שמנחים כל דבר שאנחנו עושים – מאימון ראשון עד הצלחה בגדולה."
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl p-6 transition-all group"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="text-2xl mb-4">{value.icon}</div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo transition-colors">
                {value.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
