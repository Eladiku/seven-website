"use client";

import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ValuesSection from "@/components/home/ValuesSection";
import SectionHeading from "@/components/ui/SectionHeading";
import ProgramCard from "@/components/programs/ProgramCard";
import Link from "next/link";
import { useParent } from "@/context/ParentContext";

function ProgramsSection() {
  const { siteContent } = useParent();
  const { cards } = siteContent.programs;

  return (
    <section id="programs" className="py-20" style={{ background: "#0a1018" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="תוכניות האימון"
          title="4 קבוצות גיל, אימון מותאם"
          subtitle="כל קבוצה מתאמנת לפי גיל, רמה ומטרות פיתוח ספציפיות — עם מאמן מוסמך."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {cards.map((card) => (
            <ProgramCard key={card.id} program={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-20" style={{ background: "#070d17" }}>
      <div className="max-w-3xl mx-auto px-4 text-center">
        <span className="inline-block text-xs font-bold tracking-widest text-indigo uppercase mb-4">
          צור קשר
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          דברו איתנו
        </h2>
        <p className="text-gray-400 text-lg mb-12">
          שאלות? נשמח לעזור לבחור את התוכנית המתאימה לילד שלכם.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Phone */}
          <a
            href="tel:0500000000"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all hover:border-indigo/30"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "rgba(99,102,241,0.12)" }}
            >
              📞
            </div>
            <div>
              <div className="text-white font-bold text-sm">טלפון</div>
              <div className="text-indigo font-semibold mt-0.5 text-sm" dir="ltr">050-000-0000</div>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/972500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all hover:border-indigo/30"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "rgba(99,102,241,0.12)" }}
            >
              💬
            </div>
            <div>
              <div className="text-white font-bold text-sm">WhatsApp</div>
              <div className="text-indigo font-semibold mt-0.5 text-sm" dir="ltr">050-000-0000</div>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:info@seven-academy.co.il"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all hover:border-indigo/30"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "rgba(99,102,241,0.12)" }}
            >
              ✉️
            </div>
            <div>
              <div className="text-white font-bold text-sm">אימייל</div>
              <div className="text-indigo font-semibold mt-0.5 text-sm" dir="ltr">info@seven-academy.co.il</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ValuesSection />
      <ProgramsSection />

      {/* CTA Banner */}
      <section
        className="py-16"
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
          borderTop: "1px solid rgba(99,102,241,0.3)",
          borderBottom: "1px solid rgba(99,102,241,0.3)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            מוכנים להתחיל?
          </h2>
          <p className="text-indigo/80 text-lg mb-8">
            הצטרפו לעשרות משפחות שכבר בחרו ב-Seven. מקומות מוגבלים בכל קבוצה.
          </p>
          <Link
            href="/schedule"
            className="inline-block px-8 py-4 text-white font-bold text-base rounded-xl transition-all hover:opacity-80"
            style={{ background: "#6366f1" }}
          >
            ראה לוח אימונים
          </Link>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
