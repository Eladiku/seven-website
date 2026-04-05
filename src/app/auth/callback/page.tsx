"use client";

/**
 * Auth callback page.
 *
 * Supabase magic links redirect here (emailRedirectTo = origin + /auth/callback).
 * The URL contains the session token in the hash fragment (#access_token=...).
 * The Supabase client picks it up via detectSessionInUrl during initialization,
 * which happens inside initializePromise — the same promise that getUser() awaits.
 *
 * By the time ParentContext's syncAuthUser finishes and sets isHydrating = false,
 * the session is fully established. We then redirect to the correct destination.
 * Keeping the user on this loading page prevents them from navigating to a
 * protected route before auth is settled.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParent } from "@/context/ParentContext";

export default function AuthCallbackPage() {
  const { isAuthenticated, isAdmin, isHydrating } = useParent();
  const router = useRouter();

  useEffect(() => {
    // Wait until syncAuthUser has fully completed (initializePromise resolved,
    // parent row looked up, currentUser set or confirmed absent).
    if (isHydrating) return;

    if (!isAuthenticated) {
      // Session could not be established — send to login.
      router.replace("/login");
      return;
    }

    // Authenticated: send to the correct area.
    router.replace(isAdmin ? "/admin" : "/dashboard");
  }, [isHydrating, isAuthenticated, isAdmin, router]);

  return (
    <div
      style={{
        background: "#070d17",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>
        מאמת...
      </p>
    </div>
  );
}
