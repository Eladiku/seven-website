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

  /** Clears localStorage and restores original mock data. */
  resetToMockData: () => void;
}

const ParentContext = createContext<ParentContextValue | null>(null);

export function ParentProvider({ children: node }: { children: ReactNode }) {
  const defaults = getDefaultState();

  // ── State — initialised with mock data (SSR-safe) ─────────────────────────
  // localStorage is only read inside a useEffect (client-only).
  // This keeps server and client initial renders identical, avoiding hydration
  // mismatches.
  const [children, setChildren] = useState<Child[]>(defaults.children);
  const [rawSelectedChildId, setSelectedChildId] = useState<string | null>(
    defaults.selectedChildId
  );
  const [bookings, setBookings] = useState<Booking[]>(defaults.bookings);
  const [cardUsage, setCardUsage] = useState<TrainingCard[]>(defaults.cardUsage);

  // Guards the persist effect from firing before hydration is complete.
  // Without this, the effect would overwrite localStorage with mock data
  // on the first render, before the hydration effect has a chance to read it.
  const hydrated = useRef(false);

  // ── Phase 1 — Hydrate from localStorage after mount ──────────────────────
  useEffect(() => {
    const stored = loadStateFromStorage();
    if (stored) {
      setChildren(stored.children);
      setSelectedChildId(stored.selectedChildId);
      setBookings(stored.bookings);
      if (Array.isArray(stored.cardUsage)) setCardUsage(stored.cardUsage);
    }
    // Mark hydration complete regardless of whether we found stored data,
    // so the persist effect starts writing on subsequent changes.
    hydrated.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Phase 2 — Persist entire state to a single key on every change ────────
  // Uses the resolved selectedChildId so the stored value is always valid.
  const resolvedChild =
    children.find((c) => c.id === rawSelectedChildId) ?? children[0] ?? null;

  useEffect(() => {
    if (!hydrated.current) return;
    saveStateToStorage({
      children,
      selectedChildId: resolvedChild?.id ?? null,
      bookings,
      cardUsage,
    });
  }, [children, rawSelectedChildId, bookings, cardUsage]); // eslint-disable-line react-hooks/exhaustive-deps

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
    // Bookings stay linked by childId. Birth year change does NOT remove them;
    // ScheduleFeed surfaces mismatched bookings with a visible warning instead.
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

  // ── Reset ─────────────────────────────────────────────────────────────────
  function resetToMockData() {
    clearStoredState();
    const d = getDefaultState();
    setChildren(d.children);
    setSelectedChildId(d.selectedChildId);
    setBookings(d.bookings);
    setCardUsage(d.cardUsage);
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
