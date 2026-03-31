"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useParent } from "@/context/ParentContext";

export default function SignupPage() {
  const { isAuthenticated, isHydrating } = useParent();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Redirect already-authenticated users away.
  useEffect(() => {
    if (!isHydrating && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isHydrating, router]);

  async function handleSignup() {
    setError("");

    if (!name.trim()) {
      setError("נא להזין שם מלא");
      return;
    }
    if (!email.trim()) {
      setError("נא להזין כתובת מייל");
      return;
    }

    setLoading(true);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        // Explicit signup intent flag + name so syncAuthUser can create the parent row.
        // login/page.tsx sends no metadata, so this flag reliably distinguishes
        // new parent registrations from admin/manual logins.
        data: { full_name: name.trim(), is_parent_signup: true },
        // Use current origin so the magic link works on localhost, Vercel Preview,
        // and production without any per-environment Supabase config changes.
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);

    if (otpError) {
      console.error("Signup OTP error:", otpError);
      setError("שגיאה בשליחת מייל ההרשמה. נסה שוב.");
      return;
    }

    setSent(true);
  }

  if (isHydrating) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#070d17" }}
    >
      <div className="w-full max-w-sm">
        <h1 className="text-white text-3xl font-black mb-3 text-center">
          הרשמה
        </h1>

        <p
          className="text-sm text-center mb-6"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          צור חשבון הורה חדש באקדמיית סבן
        </p>

        {sent ? (
          <div
            className="rounded-2xl px-5 py-6 text-center"
            style={{
              background: "rgba(0,200,83,0.08)",
              border: "1px solid rgba(0,200,83,0.25)",
            }}
          >
            <p className="text-lg font-bold mb-1" style={{ color: "#00c853" }}>
              הקישור נשלח!
            </p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              שלחנו לך קישור כניסה למייל
            </p>
            <p
              className="text-xs mt-2"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              לחץ על הקישור במייל כדי להיכנס
            </p>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם מלא"
              className="w-full rounded-xl px-4 py-3 mb-3 bg-white/5 text-white border border-white/10"
              dir="rtl"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-xl px-4 py-3 mb-4 bg-white/5 text-white border border-white/10"
              dir="ltr"
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full rounded-xl px-4 py-3 font-bold"
              style={{
                background: loading
                  ? "rgba(255,255,255,0.1)"
                  : "linear-gradient(135deg, #635BFF, #7C73FF)",
                color: loading ? "rgba(255,255,255,0.4)" : "white",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "שולח..." : "שלח קישור הרשמה"}
            </button>

            {error && (
              <p
                className="text-sm mt-4 text-center"
                style={{ color: "#ef4444" }}
              >
                {error}
              </p>
            )}
          </>
        )}

        <p
          className="text-xs text-center mt-6"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          כבר יש לך חשבון?{" "}
          <Link
            href="/login"
            style={{ color: "rgba(255,255,255,0.55)" }}
            className="underline"
          >
            להתחברות
          </Link>
        </p>
      </div>
    </div>
  );
}
