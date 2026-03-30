"use client";
import { supabase } from "@/lib/supabase";
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
  const [currentUser, setCurrentUser] = useState<{
  role: "admin" | "parent";
  name: string;
  email: string;
  parentId: string;
} | null>(null);
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
      // currentUser is set by the Supabase auth flow, not from localStorage.
    }
    hydrated.current = true;
    // isHydrating stays true until syncAuthUser resolves — prevents auth flicker.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function loadSessionsFromDB() {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("date", { ascending: true });
      
      if (error) {
        console.error("Error loading sessions:", error);
        return;
      }

      if (data) {
        // התאמה למבנה של TrainingSession
        const mapped = data.map((s) => ({
          id: s.id,
          date: s.date,
          time: s.time,
          ageGroup: s.age_group,
          title: s.title,
          location: s.location,
          coach: s.coach,
          birthYear: String(s.target_birth_year),
          spotsTotal: s.spots_total,
          spotsFilled: s.spots_filled,
        }));

        setSessions(mapped);
      }
    }

    loadSessionsFromDB();
  }, []);

  useEffect(() => {
  async function loadBookingsFromDB() {
    const childIds = children.map((c) => c.id);

    if (childIds.length === 0) {
      setBookings([]);
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .in("child_id", childIds);

    if (error) {
      console.error("Error loading bookings:", error);
      return;
    }

    if (data) {
      const mapped = data.map((b) => ({
        id: b.id,
        childId: b.child_id,
        sessionId: b.session_id,
        status: b.status,
      }));

      setBookings(mapped);
    }
  }

  loadBookingsFromDB();
}, [children]);

  useEffect(() => {
  async function loadCardsFromDB() {
    const childIds = children.map((c) => c.id);

    if (childIds.length === 0) {
      setCardUsage([]);
      return;
    }

    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .in("child_id", childIds);

    if (error) {
      console.error("Error loading cards:", error);
      return;
    }

    if (data) {
      const mapped = data.map((c) => ({
        id: c.id,
        childId: c.child_id,
        type: c.type ?? "10 אימונים",
        totalSessions: c.total_sessions,
        usedSessions: c.total_sessions - c.remaining_sessions,
        expiresAt: c.expires_at ?? "24.6.2026",
      }));

      setCardUsage(mapped);
    }
  }

  loadCardsFromDB();
  }, [children]);

useEffect(() => {
  async function syncAuthUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCurrentUser(null);
        setChildren([]);
        return;
      }

      // 1. Try to find parent row already linked to this auth user.
      const { data: byAuthId } = await supabase
        .from("parents")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      let parentData = byAuthId;

      if (!parentData) {
        // 2. No linked row — check by email.
        const { data: byEmail } = await supabase
          .from("parents")
          .select("*")
          .eq("email", user.email!)
          .maybeSingle();

        if (!byEmail) {
          // 2a. No parents row found by auth_user_id or email.
          // Only auto-create when the user explicitly came through the signup form,
          // identified by the is_parent_signup flag set in signup/page.tsx.
          // The login page sends no metadata, so admins and manually-created auth
          // users will never have this flag and will be denied instead of receiving
          // a phantom parent row.
          const isParentSignup = user.user_metadata?.is_parent_signup === true;
          const fullName = user.user_metadata?.full_name as string | undefined;
          if (!isParentSignup) {
            console.warn("syncAuthUser: authenticated user has no parents row and no signup intent — denying access");
            setCurrentUser(null);
            setChildren([]);
            return;
          }
          const { data: created, error: createError } = await supabase
            .from("parents")
            .insert({ name: fullName ?? user.email ?? "הורה", email: user.email, role: "parent", auth_user_id: user.id })
            .select()
            .single();
          if (createError) {
            console.error("Error creating parent record:", createError);
            setCurrentUser(null);
            setChildren([]);
            return;
          }
          parentData = created;
        } else if (!byEmail.auth_user_id) {
          // 2b. Existing unlinked row — link it.
          const { data: linked, error: linkError } = await supabase
            .from("parents")
            .update({ auth_user_id: user.id })
            .eq("id", byEmail.id)
            .select()
            .single();
          if (linkError) {
            console.error("Error linking parent record:", linkError);
            setCurrentUser(null);
            setChildren([]);
            return;
          }
          parentData = linked;
        } else {
          // 2c. Email already linked to a different auth account — refuse silently.
          console.error("Auth conflict: email already linked to another account");
          await supabase.auth.signOut();
          setCurrentUser(null);
          setChildren([]);
          return;
        }
      }

      setCurrentUser({
        role: parentData.role === "admin" ? "admin" : "parent",
        name: parentData.name ?? user.email,
        email: parentData.email,
        parentId: parentData.id,
      });
    } finally {
      setIsHydrating(false);
    }
  }

  syncAuthUser();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(() => {
    
    syncAuthUser();
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);   

useEffect(() => {
  async function loadChildrenFromDB() {
    if (!currentUser?.parentId) return;

    const query =
      currentUser.role === "admin"
        ? supabase.from("children").select("*")
        : supabase
            .from("children")
            .select("*")
            .eq("parent_id", currentUser.parentId);

    const { data, error } = await query;

    if (error) {
      console.error("Error loading children:", error);
      return;
    }

    if (data) {
      const mapped = data.map((c) => ({
        id: c.id,
        name: c.name,
        birthYear: String(c.birth_year),
      }));

      setChildren(mapped);

      if (mapped.length > 0) {
        setSelectedChildId((prev) =>
          prev && mapped.some((c) => c.id === prev) ? prev : mapped[0].id
        );
      } else {
        setSelectedChildId(null);
      }
    }
  }

  loadChildrenFromDB();
}, [currentUser]);


  useEffect(() => {
    console.log("currentUser:", currentUser);
  }, [currentUser]);

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
  async function addChild(data: Omit<Child, "id">) {
  if (!currentUser?.parentId) return;

  const newChildId = `child-${Date.now()}`;

  const { data: inserted, error } = await supabase
    .from("children")
    .insert({
      id: newChildId,
      name: data.name,
      birth_year: data.birthYear,
      parent_id: currentUser.parentId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding child:", error);
    return;
  }

  if (inserted) {
    const newChild: Child = {
      id: inserted.id,
      name: inserted.name,
      birthYear: inserted.birth_year,
    };

    setChildren((prev) => [...prev, newChild]);
    setSelectedChildId((prev) => prev ?? newChild.id);
  }
  }

  async function editChild(id: string, updates: Omit<Child, "id">) {
  const { error } = await supabase
    .from("children")
    .update({
      name: updates.name,
      birth_year: updates.birthYear,
    })
    .eq("id", id);

  if (error) {
    console.error("Error editing child:", error);
    return;
  }

  setChildren((prev) =>
    prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
  );
  }

  async function deleteChild(id: string) {
  const { error } = await supabase
    .from("children")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting child:", error);
    return;
  }

  setChildren((prev) => {
    const next = prev.filter((c) => c.id !== id);
    setSelectedChildId((sel) => (sel === id ? (next[0]?.id ?? null) : sel));
    return next;
  });

  setBookings((prev) => prev.filter((b) => b.childId !== id));
  setCardUsage((prev) => prev.filter((c) => c.childId !== id));
  setCardDevOverrides((prev) => {
    const next = { ...prev };
    delete next[id];
    return next;
   });
  }

  // ── Booking mutations ─────────────────────────────────────────────────────
  async function toggleAttendance(
  childId: string,
  session: TrainingSession
) {
  const existing = bookings.find(
    (b) => b.childId === childId && b.sessionId === session.id
  );

  // אם כבר קיים → מחיקה
  if (existing) {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", existing.id);

    if (error) {
      console.error("Error deleting booking:", error);
      return;
    }

    setBookings((prev) => prev.filter((b) => b.id !== existing.id));
    return;
  }

  // אם לא קיים → יצירה
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      child_id: childId,
      session_id: session.id,
      status: "confirmed",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    return;
  }

  if (data) {
    const newBooking = {
      id: data.id,
      childId: data.child_id,
      sessionId: data.session_id,
      status: data.status,
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
    // Auth is handled by Supabase — this legacy function is a no-op.
  }

  function loginAsAdmin() {
    // Auth is handled by Supabase — this legacy function is a no-op.
  }

  async function logout() {
    await supabase.auth.signOut();
    // Clear all user-specific state and localStorage so the next session
    // starts fresh (prevents stale data leaking between users).
    clearStoredState();
    setCurrentUser(null);
    setChildren([]);
    setBookings([]);
    setCardUsage([]);
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
