// ── Programs page content ─────────────────────────────────────────────────────

export interface ProgramCardContent {
  /** Stable identifier — matches program id in programs.ts ("u9", "u12", etc.) */
  id: string;
  /** Age group badge — used for colors, not user-editable ("U9", "U12", etc.) */
  ageGroup: string;
  title: string;
  ageRange: string;
  sessionsPerWeek: number;
  sessionDuration: string;
  description: string;
  /** Each entry is one bullet point */
  highlights: string[];
  ctaText: string;
}

export interface ProgramsContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  cards: ProgramCardContent[];
}

export interface SiteContent {
  programs: ProgramsContent;
}

// ── Defaults (mirrors programs.ts + current page copy) ────────────────────────

export const defaultSiteContent: SiteContent = {
  programs: {
    hero: {
      eyebrow: "תוכניות",
      title: "אימון מותאם לכל גיל",
      subtitle:
        "ארבע תוכניות ייחודיות שנבנו סביב הצרכים ההתפתחותיים של כל שלב גיל – מהצעדים הראשונים ועד לסף הכדורגל התחרותי.",
    },
    cards: [
      {
        id: "u9",
        ageGroup: "U9",
        title: "צעדים ראשונים",
        ageRange: "גילאי 8–9",
        sessionsPerWeek: 2,
        sessionDuration: "60 דק׳",
        description:
          "תוכנית ייחודית לשחקנים הצעירים ביותר. אנחנו מדגישים משחק, כיף ויסודות טכניים בצורה שמעוררת אהבה למשחק.",
        highlights: [
          "פיתוח מיומנויות בסיסיות",
          "משחקי קבוצות קטנות",
          "בניית ביטחון עצמי",
          "גישה משחקית ומהנה",
        ],
        ctaText: "להרשמה",
      },
      {
        id: "u12",
        ageGroup: "U12",
        title: "בניית בסיס",
        ageRange: "גילאי 10–12",
        sessionsPerWeek: 2,
        sessionDuration: "75 דק׳",
        description:
          "שלב קריטי בהתפתחות השחקן. התוכנית מתמקדת בבניית טכניקה אישית מוצקה, הבנה טקטית ראשונית ועבודת קבוצה.",
        highlights: [
          "טכניקה אישית מתקדמת",
          "הבנה טקטית בסיסית",
          "פיתוח גופני מותאם גיל",
          "תחרויות ליגה פנימיות",
        ],
        ctaText: "להרשמה",
      },
      {
        id: "u15",
        ageGroup: "U15",
        title: "מעלה רמה",
        ageRange: "גילאי 13–15",
        sessionsPerWeek: 3,
        sessionDuration: "90 דק׳",
        description:
          "עבור שחקנים שרוצים לצעוד קדימה. התוכנית כוללת אימוני כושר ייחודיים לגיל, עומק טקטי ועבודה על מנטליות תחרותית.",
        highlights: [
          "הכנה פיזית ספציפית",
          "טקטיקה מתקדמת ב-4 שלבי המשחק",
          "ניתוח וידאו בסיסי",
          "ליגת אקדמיה שבועית",
        ],
        ctaText: "להרשמה",
      },
      {
        id: "u17",
        ageGroup: "U17",
        title: "דרך לעילית",
        ageRange: "גילאי 16–17",
        sessionsPerWeek: 3,
        sessionDuration: "100 דק׳",
        description:
          "מסלול כניסה לכדורגל תחרותי ברמה גבוהה. מתאים לשחקנים עם שאיפות רציניות שרוצים את הכנה הטובה ביותר.",
        highlights: [
          "אימוני עילית ברמת מועדון",
          "תוכנית כושר אישית",
          "ניתוח טקטי מתקדם",
          "חשיפה לצופי מועדונים",
        ],
        ctaText: "להרשמה",
      },
    ],
  },
};
