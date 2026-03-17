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
    <section id="programs" className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="תוכניות האימון"
          title="4 קבוצות גיל, אימון מותאם"
          subtitle="כל קבוצה מתאמנת לפי גיל, רמה ומטרות פיתוח ספציפיות — עם מאמן מוסמך."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
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
    <section id="contact" className="py-20 bg-navy">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <span className="inline-block text-sm font-semibold tracking-widest text-green uppercase mb-4">
          צור קשר
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          דברו איתנו
        </h2>
        <p className="text-gray-400 text-lg mb-12">
          שאלות? נשמח לעזור לבחור את התוכנית המתאימה לילד שלכם.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Phone */}
          <a
            href="tel:0500000000"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-colors hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "rgba(0,200,83,0.12)" }}
            >
              📞
            </div>
            <div>
              <div className="text-white font-bold text-sm">טלפון</div>
              <div className="text-green font-semibold mt-0.5 text-sm" dir="ltr">050-000-0000</div>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/972500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-colors hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "rgba(0,200,83,0.12)" }}
            >
              💬
            </div>
            <div>
              <div className="text-white font-bold text-sm">WhatsApp</div>
              <div className="text-green font-semibold mt-0.5 text-sm" dir="ltr">050-000-0000</div>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:info@seven-academy.co.il"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-colors hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "rgba(0,200,83,0.12)" }}
            >
              ✉️
            </div>
            <div>
              <div className="text-white font-bold text-sm">אימייל</div>
              <div className="text-green font-semibold mt-0.5 text-sm" dir="ltr">info@seven-academy.co.il</div>
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
      <section className="bg-green py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-navy mb-4">
            מוכנים להתחיל?
          </h2>
          <p className="text-navy/70 text-lg mb-8">
            הצטרפו לעשרות משפחות שכבר בחרו ב-Seven. מקומות מוגבלים בכל קבוצה.
          </p>
          <Link
            href="/schedule"
            className="px-8 py-4 bg-navy text-white font-bold text-lg rounded-xl hover:bg-navy-800 transition-colors"
          >
            ראה לוח אימונים
          </Link>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
