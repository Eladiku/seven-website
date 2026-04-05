"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleEmailLogin() {
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Use current origin so the magic link works on localhost, Vercel Preview,
        // and production without any per-environment Supabase config changes.
        emailRedirectTo: window.location.origin + "/auth/callback",
      },
    });

    if (error) {
      console.error("Login error:", error);
      setError("שגיאה בשליחת מייל התחברות");
      return;
    }

    setSent(true);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#070d17" }}
    >
      <div className="w-full max-w-sm">
        <h1 className="text-white text-3xl font-black mb-3 text-center">
          כניסה
        </h1>

        <p
          className="text-sm text-center mb-6"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          הזן כתובת מייל ונשלח אליך קישור התחברות
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full rounded-xl px-4 py-3 mb-4 bg-white/5 text-white border border-white/10"
          dir="ltr"
        />

        <button
          onClick={handleEmailLogin}
          className="w-full rounded-xl px-4 py-3 font-bold"
          style={{
            background: "linear-gradient(135deg, #635BFF, #7C73FF)",
            color: "white",
          }}
        >
          שלח קישור התחברות
        </button>

        {sent && (
          <p className="text-sm mt-4 text-center" style={{ color: "#22c55e" }}>
            נשלח אליך מייל התחברות 📩
          </p>
        )}

        {error && (
          <p className="text-sm mt-4 text-center" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        <p
          className="text-xs text-center mt-6"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          אין לך חשבון?{" "}
          <Link
            href="/signup"
            style={{ color: "rgba(255,255,255,0.55)" }}
            className="underline"
          >
            להרשמה
          </Link>
        </p>
      </div>
    </div>
  );
}