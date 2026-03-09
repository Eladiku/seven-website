export interface PricingPlan {
  id: string;
  ageGroup: string;
  pricePerCard: number;
  sessionsPerCard: number;
  pricePerSession: number;
  features: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "u9-pricing",
    ageGroup: "U9 – גילאי 8–9",
    pricePerCard: 490,
    sessionsPerCard: 10,
    pricePerSession: 49,
    features: [
      "10 כניסות לאימון",
      "תקף למשך 3 חודשים",
      "מאמן מוסמך FIFA",
      "ציוד אישי בתוספת",
    ],
  },
  {
    id: "u12-pricing",
    ageGroup: "U12 – גילאי 10–12",
    pricePerCard: 590,
    sessionsPerCard: 10,
    pricePerSession: 59,
    features: [
      "10 כניסות לאימון",
      "תקף למשך 3 חודשים",
      "מאמן מוסמך UEFA B",
      "דוח התקדמות חודשי",
    ],
  },
  {
    id: "u15-pricing",
    ageGroup: "U15 – גילאי 13–15",
    pricePerCard: 690,
    sessionsPerCard: 10,
    pricePerSession: 69,
    features: [
      "10 כניסות לאימון",
      "תקף למשך 3 חודשים",
      "ניתוח וידאו בסיסי",
      "פגישת הערכה רבעונית",
    ],
  },
  {
    id: "u17-pricing",
    ageGroup: "U17 – גילאי 16–17",
    pricePerCard: 790,
    sessionsPerCard: 10,
    pricePerSession: 79,
    features: [
      "10 כניסות לאימון",
      "תקף למשך 3 חודשים",
      "תוכנית כושר אישית",
      "ייעוץ מסלול תחרותי",
    ],
  },
];

export const cardBenefits = [
  {
    icon: "🔟",
    title: "10 כניסות גמישות",
    description:
      "בחר את הימים שמתאימים לך. הכרטיסייה מאפשרת גמישות מלאה בתוך לוח הזמנים השבועי.",
  },
  {
    icon: "📅",
    title: "תקופת תוקף 3 חודשים",
    description:
      "3 חודשים מיום הרכישה להשתמש בכל 10 הכניסות. מאפשר ניהול לוח זמנים נוח.",
  },
  {
    icon: "💳",
    title: "אין מנוי חודשי",
    description:
      "שלם רק עבור מה שתשתמש. אין התחייבות חודשית, אין עמלות ביטול.",
  },
  {
    icon: "⚡",
    title: "הרשמה קלה",
    description:
      "בחר אימון פנוי, הגע, תאמן. פשוט כך. הכרטיסייה כניסה אחת בכל פעם.",
  },
];
