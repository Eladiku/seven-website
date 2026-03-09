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
    <section className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="הערכים שלנו"
          title="מה מייחד את Seven"
          subtitle="שישה עמודי תווך שמנחים כל דבר שאנחנו עושים – מאימון ראשון עד הצלחה בגדולה."
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:border-green/30 hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-4">{value.icon}</div>
              <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-green transition-colors">
                {value.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
