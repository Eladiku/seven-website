export interface TrainingSession {
  id: string;
  /** Hebrew day name: ראשון–שישי */
  day: string;
  time: string;
  ageGroup: string;
  title: string;
  location: string;
  coach: string;
  /** Reference birth year for שנתון display */
  birthYear: string;
  spotsTotal: number;
  spotsFilled: number;
}

export const weekDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];

export const schedule: TrainingSession[] = [
  // Sunday
  {
    id: "s1",
    day: "ראשון",
    time: "16:00–17:00",
    ageGroup: "U9",
    title: "כדורגל קבוצתי",
    location: "מגרש A",
    coach: "עמית לוי",
    birthYear: "2017",
    spotsTotal: 12,
    spotsFilled: 9,
  },
  {
    id: "s2",
    day: "ראשון",
    time: "17:15–18:30",
    ageGroup: "U12",
    title: "כדורגל קבוצתי",
    location: "מגרש A",
    coach: "יוסי כהן",
    birthYear: "2014",
    spotsTotal: 14,
    spotsFilled: 11,
  },
  {
    id: "s3",
    day: "ראשון",
    time: "18:45–20:15",
    ageGroup: "U15",
    title: "כדורגל קבוצתי",
    location: "מגרש B",
    coach: "רון אברהם",
    birthYear: "2011",
    spotsTotal: 16,
    spotsFilled: 16,
  },
  // Monday
  {
    id: "s4",
    day: "שני",
    time: "16:00–17:00",
    ageGroup: "U9",
    title: "כדורגל קבוצתי",
    location: "מגרש A",
    coach: "עמית לוי",
    birthYear: "2017",
    spotsTotal: 12,
    spotsFilled: 7,
  },
  {
    id: "s5",
    day: "שני",
    time: "17:15–19:05",
    ageGroup: "U17",
    title: "כדורגל קבוצתי",
    location: "מגרש B",
    coach: "דני פרץ",
    birthYear: "2009",
    spotsTotal: 16,
    spotsFilled: 14,
  },
  // Tuesday
  {
    id: "s6",
    day: "שלישי",
    time: "16:00–17:15",
    ageGroup: "U12",
    title: "כדורגל קבוצתי",
    location: "מגרש A",
    coach: "יוסי כהן",
    birthYear: "2014",
    spotsTotal: 14,
    spotsFilled: 5,
  },
  {
    id: "s7",
    day: "שלישי",
    time: "17:30–19:00",
    ageGroup: "U15",
    title: "כדורגל קבוצתי",
    location: "מגרש B",
    coach: "רון אברהם",
    birthYear: "2011",
    spotsTotal: 16,
    spotsFilled: 13,
  },
  // Wednesday
  {
    id: "s8",
    day: "רביעי",
    time: "16:00–17:00",
    ageGroup: "U9",
    title: "כדורגל קבוצתי",
    location: "מגרש A",
    coach: "עמית לוי",
    birthYear: "2017",
    spotsTotal: 12,
    spotsFilled: 12,
  },
  {
    id: "s9",
    day: "רביעי",
    time: "17:15–18:30",
    ageGroup: "U12",
    title: "כדורגל קבוצתי",
    location: "מגרש B",
    coach: "יוסי כהן",
    birthYear: "2014",
    spotsTotal: 14,
    spotsFilled: 8,
  },
  // Thursday
  {
    id: "s10",
    day: "חמישי",
    time: "17:00–18:40",
    ageGroup: "U15",
    title: "כדורגל קבוצתי",
    location: "מגרש A",
    coach: "רון אברהם",
    birthYear: "2011",
    spotsTotal: 16,
    spotsFilled: 10,
  },
  {
    id: "s11",
    day: "חמישי",
    time: "17:00–18:45",
    ageGroup: "U17",
    title: "כדורגל קבוצתי",
    location: "מגרש B",
    coach: "דני פרץ",
    birthYear: "2009",
    spotsTotal: 16,
    spotsFilled: 16,
  },
  // Friday
  {
    id: "s12",
    day: "שישי",
    time: "09:00–10:40",
    ageGroup: "U17",
    title: "כדורגל קבוצתי",
    location: "מגרש B",
    coach: "דני פרץ",
    birthYear: "2009",
    spotsTotal: 16,
    spotsFilled: 6,
  },
];

/** Maps Hebrew day name → JS getDay() index (0 = Sunday) */
export const DAY_INDEX: Record<string, number> = {
  ראשון: 0,
  שני: 1,
  שלישי: 2,
  רביעי: 3,
  חמישי: 4,
  שישי: 5,
  שבת: 6,
};

export const ageGroupColors: Record<string, string> = {
  U9: "bg-blue-100 text-blue-800",
  U12: "bg-purple-100 text-purple-800",
  U15: "bg-orange-100 text-orange-800",
  U17: "bg-green-100 text-green-800",
};
