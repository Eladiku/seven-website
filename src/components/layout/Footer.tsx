import Link from "next/link";

const footerLinks = [
  { href: "/programs", label: "תוכניות" },
  { href: "/pricing", label: "מחירים" },
  { href: "/schedule", label: "לוח אימונים" },
  { href: "/contact", label: "צור קשר" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-black text-green leading-none">7</span>
              <span className="text-white font-bold text-xl tracking-wide">SEVEN</span>
            </div>
            <p className="text-sm leading-relaxed">
              אקדמיית Seven לכדורגל נוער – מפתחים אלופים, בונים אנשים.
              אימונים מקצועיים לגילאי 8–17.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-4">ניווט מהיר</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">יצירת קשר</h3>
            <ul className="space-y-2 text-sm">
              <li>📍 רחוב הספורט 7, תל אביב</li>
              <li>📞 050-000-0000</li>
              <li>✉️ info@seven-academy.co.il</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-10 pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Seven Academy. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
}
