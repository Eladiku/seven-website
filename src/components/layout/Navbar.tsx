"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "בית" },
  { href: "/programs", label: "תוכניות" },
  { href: "/pricing", label: "כרטיסיית אימונים" },
  { href: "/schedule", label: "לוח אימונים" },
  { href: "/contact", label: "צור קשר" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-navy sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl font-black text-green leading-none">7</span>
            <span className="text-white font-bold text-xl tracking-wide">
              SEVEN
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? "text-green bg-navy-700"
                    : "text-gray-300 hover:text-white hover:bg-navy-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mr-3 px-5 py-2 bg-green text-navy text-sm font-bold rounded-lg hover:bg-green-600 transition-colors"
            >
              הצטרף עכשיו
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="תפריט"
          >
            <div className="space-y-1.5">
              <span
                className={`block w-6 h-0.5 bg-white transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-navy-700 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? "text-green bg-navy-700"
                    : "text-gray-300 hover:text-white hover:bg-navy-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 px-4">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-5 py-2.5 bg-green text-navy text-sm font-bold rounded-lg hover:bg-green-600 transition-colors"
              >
                הצטרף עכשיו
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
