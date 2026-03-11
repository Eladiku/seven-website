import { mockParent, mockBookings, mockCards } from "@/data/parent";
import type { Child, Booking, TrainingCard } from "@/data/parent";

/** The single localStorage key for the entire app state. */
export const STORAGE_KEY = "sevenAcademyState";

/** Shape of everything persisted in localStorage. */
export interface AppState {
  children: Child[];
  selectedChildId: string | null;
  bookings: Booking[];
  cardUsage: TrainingCard[];
  /**
   * Dev-only overrides for usedSessions per child.
   * When set, replaces the booking-derived count for display + eligibility.
   * Easy to remove: delete this field and its usages in context + components.
   */
  cardDevOverrides: Record<string, number>;
}

/** Original mock data — used on first load and after reset. */
export function getDefaultState(): AppState {
  return {
    children: mockParent.children,
    selectedChildId: mockParent.children[0]?.id ?? null,
    bookings: mockBookings,
    cardUsage: mockCards,
    cardDevOverrides: {},
  };
}

/**
 * Try to read and validate state from localStorage.
 * Returns null if nothing is stored, the data is malformed, or parsing fails.
 * Never throws.
 */
export function loadStateFromStorage(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    // Minimal shape validation — if core arrays are missing, treat as corrupt
    if (!Array.isArray(parsed.children) || !Array.isArray(parsed.bookings)) {
      return null;
    }
    return parsed as AppState;
  } catch {
    return null;
  }
}

/**
 * Write the full app state to localStorage under the single key.
 * Silently ignores errors (storage unavailable, quota exceeded, etc.).
 */
export function saveStateToStorage(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently ignore
  }
}

/** Remove the single app state key from localStorage. */
export function clearStoredState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently ignore
  }
}
