export interface Program {
  id: string;
  ageGroup: string;
  ageRange: string;
  title: string;
  description: string;
  highlights: string[];
  sessionsPerWeek: number;
  sessionDuration: string;
}

export const programs: Program[] = [
  {
    id: "u9",
    ageGroup: "U9",
    ageRange: "גילאי 8–9",
    title: "צעדים ראשונים",
    description:
      "תוכנית ייחודית לשחקנים הצעירים ביותר. אנחנו מדגישים משחק, כיף ויסודות טכניים בצורה שמעוררת אהבה למשחק.",
    highlights: [
      "פיתוח מיומנויות בסיסיות",
      "משחקי קבוצות קטנות",
      "בניית ביטחון עצמי",
      "גישה משחקית ומהנה",
    ],
    sessionsPerWeek: 2,
    sessionDuration: "60 דק׳",
  },
  {
    id: "u12",
    ageGroup: "U12",
    ageRange: "גילאי 10–12",
    title: "בניית בסיס",
    description:
      "שלב קריטי בהתפתחות השחקן. התוכנית מתמקדת בבניית טכניקה אישית מוצקה, הבנה טקטית ראשונית ועבודת קבוצה.",
    highlights: [
      "טכניקה אישית מתקדמת",
      "הבנה טקטית בסיסית",
      "פיתוח גופני מותאם גיל",
      "תחרויות ליגה פנימיות",
    ],
    sessionsPerWeek: 2,
    sessionDuration: "75 דק׳",
  },
  {
    id: "u15",
    ageGroup: "U15",
    ageRange: "גילאי 13–15",
    title: "מעלה רמה",
    description:
      "עבור שחקנים שרוצים לצעוד קדימה. התוכנית כוללת אימוני כושר ייחודיים לגיל, עומק טקטי ועבודה על מנטליות תחרותית.",
    highlights: [
      "הכנה פיזית ספציפית",
      "טקטיקה מתקדמת ב-4 שלבי המשחק",
      "ניתוח וידאו בסיסי",
      "ליגת אקדמיה שבועית",
    ],
    sessionsPerWeek: 3,
    sessionDuration: "90 דק׳",
  },
  {
    id: "u17",
    ageGroup: "U17",
    ageRange: "גילאי 16–17",
    title: "דרך לעילית",
    description:
      "מסלול כניסה לכדורגל תחרותי ברמה גבוהה. מתאים לשחקנים עם שאיפות רציניות שרוצים את הכנה הטובה ביותר.",
    highlights: [
      "אימוני עילית ברמת מועדון",
      "תוכנית כושר אישית",
      "ניתוח טקטי מתקדם",
      "חשיפה לצופי מועדונים",
    ],
    sessionsPerWeek: 3,
    sessionDuration: "100 דק׳",
  },
];
