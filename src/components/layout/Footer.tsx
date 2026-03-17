import Link from "next/link";

const footerLinks = [
  { href: "/#programs", label: "תוכניות" },
  { href: "/pricing", label: "כרטיסיית אימונים" },
  { href: "/schedule", label: "לוח אימונים" },
  { href: "/#contact", label: "צור קשר" },
];

export default function Footer() {
  return (
    <footer
      className="text-gray-500"
      style={{
        background: "#040810",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <svg width="44" height="49" viewBox="0 0 100 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerShieldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="45%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <path d="M50,2 L98,20 L98,68 C98,91 50,110 50,110 C50,110 2,91 2,68 L2,20 Z" fill="url(#footerShieldGrad)" />
                <path d="M50,9 L91,25 L91,67 C91,87 50,104 50,104 C50,104 9,87 9,67 L9,25 Z" fill="#040810" />
                <text x="50" y="37" textAnchor="middle" fill="white" fontSize="17" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="3">SEVEN</text>
                <text x="51" y="76" textAnchor="middle" fill="white" fontSize="40" fontWeight="900" fontFamily="Arial, sans-serif" fontStyle="italic">7</text>
                <text x="50" y="96" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8.5" fontFamily="Arial, sans-serif" letterSpacing="0.5">אקדמיה לכדורגל</text>
              </svg>
            </div>
            <p className="text-sm leading-relaxed">
              אקדמיית Seven לכדורגל נוער – מפתחים אלופים, בונים אנשים.
              אימונים מקצועיים לגילאי 8–17.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">ניווט</h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">קשר</h3>
            <ul className="space-y-2.5 text-sm">
              <li>📍 רחוב הספורט 7, תל אביב</li>
              <li>📞 050-000-0000</li>
              <li>✉️ info@seven-academy.co.il</li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-center text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.2)" }}
        >
          © {new Date().getFullYear()} Seven Academy. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
}
