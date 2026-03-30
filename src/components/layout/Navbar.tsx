"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useParent } from "@/context/ParentContext";

const parentLinks = [
  { href: "/", label: "בית" },
  { href: "/schedule", label: "לוח אימונים" },
  { href: "/pricing", label: "כרטיסיית אימונים" },
  { href: "/dashboard", label: "אזור אישי" },
];

const adminLinks = [
  { href: "/", label: "בית" },
  { href: "/schedule", label: "לוח אימונים" },
  { href: "/admin", label: "ניהול מערכת" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin, isAuthenticated, logout } = useParent();

  const navLinks = isAdmin ? adminLinks : parentLinks;

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(7,13,23,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <svg width="34" height="38" viewBox="0 0 100 112" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="navShieldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="45%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <path d="M50,2 L98,20 L98,68 C98,91 50,110 50,110 C50,110 2,91 2,68 L2,20 Z" fill="url(#navShieldGrad)" />
              <path d="M50,9 L91,25 L91,67 C91,87 50,104 50,104 C50,104 9,87 9,67 L9,25 Z" fill="#0d1117" />
              <text x="50" y="37" textAnchor="middle" fill="white" fontSize="17" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="3">SEVEN</text>
              <text x="51" y="76" textAnchor="middle" fill="white" fontSize="40" fontWeight="900" fontFamily="Arial, sans-serif" fontStyle="italic">7</text>
              <text x="50" y="96" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8.5" fontFamily="Arial, sans-serif" letterSpacing="0.5">אקדמיה לכדורגל</text>
            </svg>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? "text-indigo bg-indigo/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-5 bg-white/10 mx-2" />
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); router.push("/"); }}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-gray-500 hover:text-white hover:bg-white/5"
              >
                יציאה
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all text-white bg-indigo hover:bg-indigo-600"
              >
                כניסה
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white p-2 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="תפריט"
          >
            <div className="space-y-1.5">
              <span
                className={`block w-5 h-0.5 bg-current transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-current transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-current transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden py-3 space-y-1"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? "text-indigo bg-indigo/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 px-4">
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); router.push("/"); setMobileOpen(false); }}
                  className="block w-full text-center px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  יציאה
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-5 py-2.5 rounded-lg text-sm font-bold bg-indigo text-white hover:bg-indigo-600 transition-colors"
                >
                  כניסה
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
