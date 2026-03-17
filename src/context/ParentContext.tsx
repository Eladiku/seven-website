"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Child, Booking, TrainingCard } from "@/data/parent";
import type { TrainingSession } from "@/data/schedule";
import type { SiteContent, ProgramsContent, ProgramCardContent } from "@/data/siteContent";
import type { Coach, Field } from "@/lib/storage";
import {
  loadStateFromStorage,
  saveStateToStorage,
  clearStoredState,
  getDefaultState,
} from "@/lib/storage";

// ── Context interface ─────────────────────────────────────────────────────────
interface ParentContextValue {
  children: Child[];
  addChild: (data: Omit<Child, "id">) => void;
  editChild: (id: string, updates: Omit<Child, "id">) => void;
  deleteChild: (id: string) => void;

  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  /** Always-valid resolved child (falls back to first child if selection stale) */
  selectedChild: Child | null;

  bookings: Booking[];
  toggleAttendance: (
    childId: string,
    session: TrainingSession
  ) => void;
  cancelBooking: (id: string) => void;

  cardUsage: TrainingCard[];

  sessions: TrainingSession[];
  addSession: (data: Omit<TrainingSession, "id" | "spotsFilled">) => void;
  updateSession: (id: string, data: Omit<TrainingSession, "id" | "spotsFilled">) => void;
  deleteSession: (id: string) => void;

  coaches: Coach[];
  addCoach: (name: string) => void;
  updateCoach: (id: string, name: string) => void;
  deleteCoach: (id: string) => void;

  fields: Field[];
  addField: (name: string) => void;
  updateField: (id: string, name: string) => void;
  deleteField: (id: string) => void;

  /** Assign a fresh 10-session card to a child (no-op if card already exists). */
  assignCard: (childId: string) => void;
  /** Remove a child's training card and clear any dev override. */
  removeCard: (childId: string) => void;

  /**
   * Dev-only overrides: when set for a child, replaces the booking-derived
   * usedSessions count for display and eligibility everywhere.
   */
  cardDevOverrides: Record<string, number>;
  devSetCardUsed: (childId: string, used: number | null) => void;

  /** Clears localStorage and restores original mock data. */
  resetToMockData: () => void;

  // ── Site content ────────────────────────────────────────────────────────────
  siteContent: SiteContent;
  updateProgramsHero: (hero: ProgramsContent["hero"]) => void;
  updateProgramCard: (id: string, updates: Partial<ProgramCardContent>) => void;
  resetSiteContent: () => void;

  // ── Auth ─────────────────────────────────────────────────────────────────────
  currentUser: { role: "admin" | "parent"; name: string } | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** True while localStorage is being read on mount — prevents auth flicker. */
  isHydrating: boolean;
  loginAsParent: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
}

const ParentContext = createContext<ParentContextValue | null>(null);

export function ParentProvider({ children: node }: { children: ReactNode }) {
  const defaults = getDefaultState();

  // ── State — initialised with mock data (SSR-safe) ─────────────────────────
  const [children, setChildren] = useState<Child[]>(defaults.children);
  const [rawSelectedChildId, setSelectedChildId] = useState<string | null>(
    defaults.selectedChildId
  );
  const [bookings, setBookings] = useState<Booking[]>(defaults.bookings);
  const [cardUsage, setCardUsage] = useState<TrainingCard[]>(defaults.cardUsage);
  const [sessions, setSessions] = useState<TrainingSession[]>(defaults.sessions);
  const [coaches, setCoaches] = useState<Coach[]>(defaults.coaches);
  const [fields, setFields] = useState<Field[]>(defaults.fields);
  const [cardDevOverrides, setCardDevOverrides] = useState<Record<string, number>>(
    defaults.cardDevOverrides
  );
  const [siteContent, setSiteContent] = useState<SiteContent>(defaults.siteContent);
  const [currentUser, setCurrentUser] = useState<{ role: "admin" | "parent"; name: string } | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  // Guards the persist effect from firing before hydration is complete.
  const hydrated = useRef(false);

  // ── Phase 1 — Hydrate from localStorage after mount ──────────────────────
  useEffect(() => {
    const stored = loadStateFromStorage();
    if (stored) {
      setChildren(stored.children);
      setSelectedChildId(stored.selectedChildId);
      // Deduplicate bookings: keep only the first booking per childId+sessionId pair.
      // Duplicates can exist in old localStorage data due to the stale-closure bug.
      const dedupedBookings = stored.bookings.reduce<Booking[]>((acc, b) => {
        if (!acc.some((x) => x.childId === b.childId && x.sessionId === b.sessionId)) {
          acc.push(b);
        }
        return acc;
      }, []);
      setBookings(dedupedBookings);
      if (Array.isArray(stored.cardUsage)) setCardUsage(stored.cardUsage);
      // Migration guard: stored sessions from before the refactor used `day`
      // (Hebrew weekday name) instead of `date` (ISO string). If any session
      // is missing a valid date, discard the entire stored list and use the
      // current defaults so the UI always shows real dated sessions.
      if (
        Array.isArray(stored.sessions) &&
        stored.sessions.length > 0 &&
        stored.sessions.every((s) => typeof (s as TrainingSession).date === "string" && (s as TrainingSession).date.length > 0)
      ) {
        setSessions(stored.sessions);
      } else {
        setSessions(defaults.sessions);
      }
      // Fall back to defaults if coaches/fields missing (old localStorage data)
      if (Array.isArray(stored.coaches) && stored.coaches.length > 0) {
        setCoaches(stored.coaches);
      } else {
        setCoaches(defaults.coaches);
      }
      if (Array.isArray(stored.fields) && stored.fields.length > 0) {
        setFields(stored.fields);
      } else {
        setFields(defaults.fields);
      }
      if (stored.cardDevOverrides && typeof stored.cardDevOverrides === "object") {
        setCardDevOverrides(stored.cardDevOverrides);
      }
      if (stored.siteContent) {
        setSiteContent(stored.siteContent);
      }
      if (stored.auth?.currentUser) {
        setCurrentUser(stored.auth.currentUser);
      }
    }
    hydrated.current = true;
    setIsHydrating(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Phase 2 — Persist entire state on every change ────────────────────────
  const resolvedChild =
    children.find((c) => c.id === rawSelectedChildId) ?? children[0] ?? null;

  useEffect(() => {
    if (!hydrated.current) return;
    saveStateToStorage({
      children,
      selectedChildId: resolvedChild?.id ?? null,
      bookings,
      cardUsage,
      sessions,
      coaches,
      fields,
      cardDevOverrides,
      siteContent,
      auth: { currentUser },
    });
  }, [children, rawSelectedChildId, bookings, cardUsage, sessions, coaches, fields, cardDevOverrides, siteContent, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Children mutations ────────────────────────────────────────────────────
  function addChild(data: Omit<Child, "id">) {
    const newChild: Child = { id: `child-${Date.now()}`, ...data };
    setChildren((prev) => [...prev, newChild]);
    setSelectedChildId((prev) => prev ?? newChild.id);
  }

  function editChild(id: string, updates: Omit<Child, "id">) {
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }

  function deleteChild(id: string) {
    setChildren((prev) => {
      const next = prev.filter((c) => c.id !== id);
      setSelectedChildId((sel) =>
        sel === id ? (next[0]?.id ?? null) : sel
      );
      return next;
    });
    // Cascade: remove all data associated with this child
    setBookings((prev) => prev.filter((b) => b.childId !== id));
    setCardUsage((prev) => prev.filter((c) => c.childId !== id));
    setCardDevOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  // ── Booking mutations ─────────────────────────────────────────────────────
  function toggleAttendance(
    childId: string,
    session: TrainingSession
  ) {
    // Use a functional updater so the check always reads the latest state,
    // preventing duplicates from double-clicks or stale closure reads.
    setBookings((prev) => {
      const existing = prev.find(
        (b) => b.childId === childId && b.sessionId === session.id
      );
      if (existing) {
        return prev.filter((b) => b.id !== existing.id);
      }
      const newBooking: Booking = {
        id: `b-${Date.now()}`,
        childId,
        sessionId: session.id,
        status: "confirmed",
      };
      return [...prev, newBooking];
    });
  }

  function cancelBooking(id: string) {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  // ── Session mutations (admin) ─────────────────────────────────────────────
  function addSession(data: Omit<TrainingSession, "id" | "spotsFilled">) {
    const newSession: TrainingSession = {
      id: `s-${Date.now()}`,
      spotsFilled: 0,
      ...data,
    };
    setSessions((prev) => [...prev, newSession]);
  }

  function updateSession(id: string, data: Omit<TrainingSession, "id" | "spotsFilled">) {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  }

  function deleteSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setBookings((prev) => prev.filter((b) => b.sessionId !== id));
  }

  // ── Coach mutations (admin) ───────────────────────────────────────────────
  function addCoach(name: string) {
    const newCoach: Coach = { id: `coach-${Date.now()}`, name };
    setCoaches((prev) => [...prev, newCoach]);
  }

  function updateCoach(id: string, name: string) {
    setCoaches((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  }

  function deleteCoach(id: string) {
    setCoaches((prev) => prev.filter((c) => c.id !== id));
  }

  // ── Field mutations (admin) ───────────────────────────────────────────────
  function addField(name: string) {
    const newField: Field = { id: `field-${Date.now()}`, name };
    setFields((prev) => [...prev, newField]);
  }

  function updateField(id: string, name: string) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  }

  function deleteField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }

  // ── Card assign / remove ─────────────────────────────────────────────────
  function assignCard(childId: string) {
    if (cardUsage.some((c) => c.childId === childId)) return;
    const newCard: TrainingCard = {
      id: `card-${Date.now()}`,
      childId,
      type: "10 אימונים",
      totalSessions: 10,
      usedSessions: 0,
      expiresAt: "24.6.2026",
    };
    setCardUsage((prev) => [...prev, newCard]);
  }

  function removeCard(childId: string) {
    setCardUsage((prev) => prev.filter((c) => c.childId !== childId));
    setCardDevOverrides((prev) => {
      const next = { ...prev };
      delete next[childId];
      return next;
    });
  }

  // ── Dev override ──────────────────────────────────────────────────────────
  function devSetCardUsed(childId: string, used: number | null) {
    setCardDevOverrides((prev) => {
      if (used === null) {
        const next = { ...prev };
        delete next[childId];
        return next;
      }
      return { ...prev, [childId]: used };
    });
  }

  // ── Auth mutations ────────────────────────────────────────────────────────
  function loginAsParent() {
    setCurrentUser({ role: "parent", name: "הורה" });
  }

  function loginAsAdmin() {
    setCurrentUser({ role: "admin", name: "מנהל" });
  }

  function logout() {
    setCurrentUser(null);
  }

  // ── Site content mutations ────────────────────────────────────────────────
  function updateProgramsHero(hero: ProgramsContent["hero"]) {
    setSiteContent((prev) => ({
      ...prev,
      programs: { ...prev.programs, hero },
    }));
  }

  function updateProgramCard(id: string, updates: Partial<ProgramCardContent>) {
    setSiteContent((prev) => ({
      ...prev,
      programs: {
        ...prev.programs,
        cards: prev.programs.cards.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      },
    }));
  }

  function resetSiteContent() {
    setSiteContent(getDefaultState().siteContent);
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  function resetToMockData() {
    clearStoredState();
    const d = getDefaultState();
    setChildren(d.children);
    setSelectedChildId(d.selectedChildId);
    setBookings(d.bookings);
    setCardUsage(d.cardUsage);
    setSessions(d.sessions);
    setCoaches(d.coaches);
    setFields(d.fields);
    setCardDevOverrides(d.cardDevOverrides);
    setSiteContent(d.siteContent);
    setCurrentUser(null);
  }

  return (
    <ParentContext.Provider
      value={{
        children,
        addChild,
        editChild,
        deleteChild,
        selectedChildId: resolvedChild?.id ?? null,
        setSelectedChildId,
        selectedChild: resolvedChild,
        bookings,
        toggleAttendance,
        cancelBooking,
        cardUsage,
        sessions,
        addSession,
        updateSession,
        deleteSession,
        coaches,
        addCoach,
        updateCoach,
        deleteCoach,
        fields,
        addField,
        updateField,
        deleteField,
        assignCard,
        removeCard,
        cardDevOverrides,
        devSetCardUsed,
        resetToMockData,
        siteContent,
        updateProgramsHero,
        updateProgramCard,
        resetSiteContent,
        currentUser,
        isAuthenticated: currentUser !== null,
        isAdmin: currentUser?.role === "admin",
        isHydrating,
        loginAsParent,
        loginAsAdmin,
        logout,
      }}
    >
      {node}
    </ParentContext.Provider>
  );
}

export function useParent(): ParentContextValue {
  const ctx = useContext(ParentContext);
  if (!ctx) throw new Error("useParent must be used inside ParentProvider");
  return ctx;
}
