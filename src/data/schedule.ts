export interface TrainingSession {
  id: string;
  /** ISO date "2026-03-17" */
  date: string;
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

export const ageGroupColors: Record<string, string> = {
  U9: "bg-blue-100 text-blue-800",
  U12: "bg-purple-100 text-purple-800",
  U15: "bg-orange-100 text-orange-800",
  U17: "bg-green-100 text-green-800",
};

export const schedule: TrainingSession[] = [
  // ── Past sessions (before 2026-03-15) ─────────────────────────────────────
  {
    id: "p1",
    date: "2026-03-08",
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
    id: "p2",
    date: "2026-03-10",
    time: "17:30–19:00",
    ageGroup: "U15",
    title: "כדורגל קבוצתי",
    location: "מגרש B",
    coach: "רון אברהם",
    birthYear: "2011",
    spotsTotal: 16,
    spotsFilled: 13,
  },
  {
    id: "p3",
    date: "2026-03-10",
    time: "16:00–17:15",
    ageGroup: "U12",
    title: "כדורגל קבוצתי",
    location: "מגרש A",
    coach: "יוסי כהן",
    birthYear: "2014",
    spotsTotal: 14,
    spotsFilled: 8,
  },
  {
    id: "p4",
    date: "2026-03-12",
    time: "17:00–18:40",
    ageGroup: "U15",
    title: "כדורגל קבוצתי",
    location: "מגרש A",
    coach: "רון אברהם",
    birthYear: "2011",
    spotsTotal: 16,
    spotsFilled: 10,
  },

  // ── Upcoming sessions (from 2026-03-15) ────────────────────────────────────
  // Sunday 2026-03-15
  {
    id: "s1",
    date: "2026-03-15",
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
    date: "2026-03-15",
    time: "17:15–18:30",
    ageGroup: "U12",
    title: "כדורגל קבוצתי",
    location: "מגרש A",
    coach: "יוסי כהן",
    birthYear: "2014",
    spotsTotal: 14,
    spotsFilled: 8,
  },
  {
    id: "s3",
    date: "2026-03-15",
    time: "18:45–20:15",
    ageGroup: "U15",
    title: "כדורגל קבוצתי",
    location: "מגרש B",
    coach: "רון אברהם",
    birthYear: "2011",
    spotsTotal: 16,
    spotsFilled: 7,
  },
  // Monday 2026-03-16
  {
    id: "s4",
    date: "2026-03-16",
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
    date: "2026-03-16",
    time: "17:15–19:05",
    ageGroup: "U17",
    title: "כדורגל קבוצתי",
    location: "מגרש B",
    coach: "דני פרץ",
    birthYear: "2009",
    spotsTotal: 16,
    spotsFilled: 14,
  },
  // Tuesday 2026-03-17
  {
    id: "s6",
    date: "2026-03-17",
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
    date: "2026-03-17",
    time: "17:30–19:00",
    ageGroup: "U15",
    title: "כדורגל קבוצתי",
    location: "מגרש B",
    coach: "רון אברהם",
    birthYear: "2011",
    spotsTotal: 16,
    spotsFilled: 6,
  },
  // Wednesday 2026-03-18
  {
    id: "s8",
    date: "2026-03-18",
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
    date: "2026-03-18",
    time: "17:15–18:30",
    ageGroup: "U12",
    title: "כדורגל קבוצתי",
    location: "מגרש B",
    coach: "יוסי כהן",
    birthYear: "2014",
    spotsTotal: 14,
    spotsFilled: 4,
  },
  // Thursday 2026-03-19
  {
    id: "s10",
    date: "2026-03-19",
    time: "17:00–18:40",
    ageGroup: "U15",
    title: "כדורגל קבוצתי",
    location: "מגרש A",
    coach: "רון אברהם",
    birthYear: "2011",
    spotsTotal: 16,
    spotsFilled: 9,
  },
  {
    id: "s11",
    date: "2026-03-19",
    time: "17:00–18:45",
    ageGroup: "U17",
    title: "כדורגל קבוצתי",
    location: "מגרש B",
    coach: "דני פרץ",
    birthYear: "2009",
    spotsTotal: 16,
    spotsFilled: 16,
  },
  // Sunday 2026-03-22
  {
    id: "s12",
    date: "2026-03-22",
    time: "17:15–18:30",
    ageGroup: "U12",
    title: "כדורגל קבוצתי",
    location: "מגרש A",
    coach: "יוסי כהן",
    birthYear: "2014",
    spotsTotal: 14,
    spotsFilled: 3,
  },
];
