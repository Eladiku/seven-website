"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParent } from "@/context/ParentContext";

/** MVP admin password — client-side only, not a real secret. */
const ADMIN_PASSWORD = "seven2026";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsParent, loginAsAdmin, isAuthenticated, currentUser } = useParent();

  const [step, setStep] = useState<"choose" | "admin-password">("choose");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Already logged in — show current user + options
  if (isAuthenticated && currentUser) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "#070d17" }}
      >
        <div className="w-full max-w-sm text-center">
          <div className="text-4xl mb-4">👋</div>
          <p className="text-white font-bold text-lg mb-1">
            שלום, {currentUser.name}
          </p>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            מחובר כ{currentUser.role === "admin" ? "מנהל" : "הורה"}
          </p>
          <button
            onClick={() => router.push(currentUser.role === "admin" ? "/admin" : "/dashboard")}
            className="w-full py-3 rounded-xl font-black text-sm mb-3 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07100e" }}
          >
            {currentUser.role === "admin" ? "אזור הניהול" : "אזור אישי"}
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            לדף הבית
          </button>
        </div>
      </div>
    );
  }

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      loginAsAdmin();
      router.push("/admin");
    } else {
      setError("סיסמה שגויה");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#070d17" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-4xl font-black leading-none" style={{ color: "#c9a84c" }}>7</span>
            <div>
              <div className="text-white font-black tracking-widest text-lg leading-none">SEVEN</div>
              <div className="text-gray-600 tracking-widest uppercase text-xs">Academy</div>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">
            {step === "choose" ? "כניסה למערכת" : "כניסת מנהל"}
          </h1>
          <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
            {step === "choose" ? "בחרו את סוג הכניסה" : "הזינו את סיסמת המנהל"}
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {step === "choose" ? (
            <div className="space-y-3">
              {/* Parent login */}
              <button
                onClick={() => { loginAsParent(); router.push("/dashboard"); }}
                className="w-full rounded-xl p-5 text-right transition-all hover:opacity-90"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "rgba(34,197,94,0.12)" }}
                  >
                    👨‍👩‍👧
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">כניסה כהורה</div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      צפייה בכרטיסייה, אימונים והרשמות
                    </div>
                  </div>
                </div>
              </button>

              {/* Admin login */}
              <button
                onClick={() => setStep("admin-password")}
                className="w-full rounded-xl p-5 text-right transition-all hover:opacity-90"
                style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "rgba(201,168,76,0.12)" }}
                  >
                    🔑
                  </div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: "#c9a84c" }}>כניסה כמנהל</div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      ניהול אימונים, ילדים ותוכן האתר
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  סיסמה
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="הזן סיסמה"
                  autoFocus
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white outline-none transition-colors bg-white/5 border border-white/10 focus:border-[rgba(201,168,76,0.5)]"
                />
                {error && (
                  <p className="text-xs mt-1.5 font-semibold" style={{ color: "#fca5a5" }}>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-black text-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07100e" }}
              >
                כניסה
              </button>

              <button
                type="button"
                onClick={() => { setStep("choose"); setPassword(""); setError(""); }}
                className="w-full py-2.5 rounded-xl font-semibold text-xs"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                ← חזרה
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.15)" }}>
          MVP · כניסת הורה אינה מאובטחת
        </p>
      </div>
    </div>
  );
}
