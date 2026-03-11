export interface Child {
  id: string;
  name: string;
  birthYear: string;
}

export interface Parent {
  id: string;
  name: string;
  children: Child[];
}

export interface TrainingCard {
  id: string;
  childId: string;
  /** e.g. "10 אימונים" */
  type: string;
  totalSessions: number;
  usedSessions: number;
  /** Display string e.g. "24.6.2026" */
  expiresAt: string;
}

export interface Booking {
  id: string;
  childId: string;
  /** References TrainingSession.id from schedule data */
  sessionId: string;
  /** ISO date "2026-03-17" */
  date: string;
  /** Hebrew display e.g. "שלישי, 17 מרץ" */
  dayLabel: string;
  time: string;
  title: string;
  location: string;
  coach: string;
  status: "confirmed" | "completed";
}

/**
 * Mock parent — replace with real auth/API later.
 * birthYear values match schedule data for a working demo.
 */
export const mockParent: Parent = {
  id: "parent-1",
  name: "אלעד",
  children: [
    { id: "child-1", name: "יונתן", birthYear: "2014" },
    { id: "child-2", name: "יעל", birthYear: "2011" },
  ],
};

/** Mock training cards — one per child */
export const mockCards: TrainingCard[] = [
  {
    id: "card-1",
    childId: "child-1",
    type: "10 אימונים",
    totalSessions: 10,
    usedSessions: 3,
    expiresAt: "24.6.2026",
  },
  {
    id: "card-2",
    childId: "child-2",
    type: "10 אימונים",
    totalSessions: 10,
    usedSessions: 6,
    expiresAt: "15.9.2026",
  },
];

/** Mock bookings — upcoming + past.
 *  sessionId references TrainingSession.id in schedule.ts.
 *  Session map (for reference):
 *   s2 = ראשון  U12/2014  17:15–18:30  מגרש A  יוסי כהן
 *   s6 = שלישי  U12/2014  16:00–17:15  מגרש A  יוסי כהן
 *   s3 = ראשון  U15/2011  18:45–20:15  מגרש B  רון אברהם
 *   s7 = שלישי  U15/2011  17:30–19:00  מגרש B  רון אברהם
 *  s10 = חמישי  U15/2011  17:00–18:40  מגרש A  רון אברהם
 */
export const mockBookings: Booking[] = [
  // יונתן (child-1) — upcoming
  { id: "b1",  childId: "child-1", sessionId: "s2",  date: "2026-03-15", dayLabel: "ראשון, 15 מרץ",       time: "17:15–18:30", title: "כדורגל קבוצתי", location: "מגרש A", coach: "יוסי כהן",  status: "confirmed" },
  { id: "b2",  childId: "child-1", sessionId: "s6",  date: "2026-03-17", dayLabel: "שלישי, 17 מרץ",       time: "16:00–17:15", title: "כדורגל קבוצתי", location: "מגרש A", coach: "יוסי כהן",  status: "confirmed" },
  { id: "b3",  childId: "child-1", sessionId: "s2",  date: "2026-03-22", dayLabel: "ראשון, 22 מרץ",       time: "17:15–18:30", title: "כדורגל קבוצתי", location: "מגרש A", coach: "יוסי כהן",  status: "confirmed" },
  // יונתן — past
  { id: "b4",  childId: "child-1", sessionId: "s2",  date: "2026-03-08", dayLabel: "ראשון, 8 מרץ",        time: "17:15–18:30", title: "כדורגל קבוצתי", location: "מגרש A", coach: "יוסי כהן",  status: "completed" },
  { id: "b5",  childId: "child-1", sessionId: "s6",  date: "2026-03-03", dayLabel: "שלישי, 3 מרץ",        time: "16:00–17:15", title: "כדורגל קבוצתי", location: "מגרש A", coach: "יוסי כהן",  status: "completed" },
  { id: "b6",  childId: "child-1", sessionId: "s2",  date: "2026-03-01", dayLabel: "ראשון, 1 מרץ",        time: "17:15–18:30", title: "כדורגל קבוצתי", location: "מגרש A", coach: "יוסי כהן",  status: "completed" },
  // יעל (child-2) — upcoming
  { id: "b7",  childId: "child-2", sessionId: "s3",  date: "2026-03-15", dayLabel: "ראשון, 15 מרץ",       time: "18:45–20:15", title: "כדורגל קבוצתי", location: "מגרש B", coach: "רון אברהם", status: "confirmed" },
  { id: "b8",  childId: "child-2", sessionId: "s7",  date: "2026-03-17", dayLabel: "שלישי, 17 מרץ",       time: "17:30–19:00", title: "כדורגל קבוצתי", location: "מגרש B", coach: "רון אברהם", status: "confirmed" },
  // יעל — past
  { id: "b9",  childId: "child-2", sessionId: "s3",  date: "2026-03-08", dayLabel: "ראשון, 8 מרץ",        time: "18:45–20:15", title: "כדורגל קבוצתי", location: "מגרש B", coach: "רון אברהם", status: "completed" },
  { id: "b10", childId: "child-2", sessionId: "s10", date: "2026-03-05", dayLabel: "חמישי, 5 מרץ",        time: "17:00–18:40", title: "כדורגל קבוצתי", location: "מגרש A", coach: "רון אברהם", status: "completed" },
  { id: "b11", childId: "child-2", sessionId: "s7",  date: "2026-03-03", dayLabel: "שלישי, 3 מרץ",        time: "17:30–19:00", title: "כדורגל קבוצתי", location: "מגרש B", coach: "רון אברהם", status: "completed" },
  { id: "b12", childId: "child-2", sessionId: "s10", date: "2026-02-26", dayLabel: "חמישי, 26 פברואר",    time: "17:00–18:40", title: "כדורגל קבוצתי", location: "מגרש A", coach: "רון אברהם", status: "completed" },
  { id: "b13", childId: "child-2", sessionId: "s7",  date: "2026-02-24", dayLabel: "שלישי, 24 פברואר",    time: "17:30–19:00", title: "כדורגל קבוצתי", location: "מגרש B", coach: "רון אברהם", status: "completed" },
  { id: "b14", childId: "child-2", sessionId: "s3",  date: "2026-02-22", dayLabel: "ראשון, 22 פברואר",    time: "18:45–20:15", title: "כדורגל קבוצתי", location: "מגרש B", coach: "רון אברהם", status: "completed" },
];
