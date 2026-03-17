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
  /** References TrainingSession.id */
  sessionId: string;
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
    usedSessions: 4,
    expiresAt: "15.9.2026",
  },
];

/**
 * Mock bookings — upcoming (confirmed) + past (completed).
 * Session IDs reference schedule.ts.
 *   child-1 (יונתן, 2014 = U12): sessions s2, s6, s12 (upcoming), p1, p3 (past)
 *   child-2 (יעל, 2011 = U15):   sessions s3, s7, s10 (upcoming), p2, p4 (past)
 */
export const mockBookings: Booking[] = [
  // יונתן (child-1) — upcoming
  { id: "b1", childId: "child-1", sessionId: "s2",  status: "confirmed" },
  { id: "b2", childId: "child-1", sessionId: "s6",  status: "confirmed" },
  { id: "b3", childId: "child-1", sessionId: "s12", status: "confirmed" },
  // יונתן — past
  { id: "b4", childId: "child-1", sessionId: "p1",  status: "completed" },
  { id: "b5", childId: "child-1", sessionId: "p3",  status: "completed" },
  // יעל (child-2) — upcoming
  { id: "b7", childId: "child-2", sessionId: "s3",  status: "confirmed" },
  { id: "b8", childId: "child-2", sessionId: "s7",  status: "confirmed" },
  { id: "b9", childId: "child-2", sessionId: "s10", status: "confirmed" },
  // יעל — past
  { id: "b10", childId: "child-2", sessionId: "p2", status: "completed" },
  { id: "b11", childId: "child-2", sessionId: "p4", status: "completed" },
];
