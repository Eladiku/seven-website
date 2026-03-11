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
    session: TrainingSession,
    date: string,
    dayLabel: string
  ) => void;
  cancelBooking: (id: string) => void;

  cardUsage: TrainingCard[];

  sessions: TrainingSession[];
  addSession: (data: Omit<TrainingSession, "id" | "spotsFilled">) => void;
  updateSession: (id: string, data: Omit<TrainingSession, "id" | "spotsFilled">) => void;
  deleteSession: (id: string) => void;

  /**
   * Dev-only overrides: when set for a child, replaces the booking-derived
   * usedSessions count for display and eligibility everywhere.
   * Set to null to remove the override and return to derived count.
   */
  cardDevOverrides: Record<string, number>;
  devSetCardUsed: (childId: string, used: number | null) => void;

  /** Clears localStorage and restores original mock data. */
  resetToMockData: () => void;
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
  const [cardDevOverrides, setCardDevOverrides] = useState<Record<string, number>>(
    defaults.cardDevOverrides
  );

  // Guards the persist effect from firing before hydration is complete.
  const hydrated = useRef(false);

  // ── Phase 1 — Hydrate from localStorage after mount ──────────────────────
  useEffect(() => {
    const stored = loadStateFromStorage();
    if (stored) {
      setChildren(stored.children);
      setSelectedChildId(stored.selectedChildId);
      setBookings(stored.bookings);
      if (Array.isArray(stored.cardUsage)) setCardUsage(stored.cardUsage);
      // Fall back to default schedule if sessions missing (old localStorage data)
      if (Array.isArray(stored.sessions)) setSessions(stored.sessions);
      if (stored.cardDevOverrides && typeof stored.cardDevOverrides === "object") {
        setCardDevOverrides(stored.cardDevOverrides);
      }
    }
    hydrated.current = true;
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
      cardDevOverrides,
    });
  }, [children, rawSelectedChildId, bookings, cardUsage, sessions, cardDevOverrides]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }

  // ── Booking mutations ─────────────────────────────────────────────────────
  function toggleAttendance(
    childId: string,
    session: TrainingSession,
    date: string,
    dayLabel: string
  ) {
    const existing = bookings.find(
      (b) =>
        b.childId === childId &&
        b.sessionId === session.id &&
        b.date === date
    );

    if (existing) {
      setBookings((prev) => prev.filter((b) => b.id !== existing.id));
    } else {
      const newBooking: Booking = {
        id: `b-${Date.now()}`,
        childId,
        sessionId: session.id,
        date,
        dayLabel,
        time: session.time,
        title: session.title,
        location: session.location,
        coach: session.coach,
        status: "confirmed",
      };
      setBookings((prev) => [...prev, newBooking]);
    }
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
    // Remove orphaned bookings for this session
    setBookings((prev) => prev.filter((b) => b.sessionId !== id));
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

  // ── Reset ─────────────────────────────────────────────────────────────────
  function resetToMockData() {
    clearStoredState();
    const d = getDefaultState();
    setChildren(d.children);
    setSelectedChildId(d.selectedChildId);
    setBookings(d.bookings);
    setCardUsage(d.cardUsage);
    setSessions(d.sessions);
    setCardDevOverrides(d.cardDevOverrides);
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
        cardDevOverrides,
        devSetCardUsed,
        resetToMockData,
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
