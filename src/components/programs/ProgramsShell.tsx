"use client";

import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import ProgramCard from "./ProgramCard";
import { useParent } from "@/context/ParentContext";

export default function ProgramsShell() {
  const { siteContent } = useParent();
  const { hero, cards } = siteContent.programs;

  return (
    <>
      {/* Page header */}
      <div className="py-16" style={{ background: "#070d17" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-bold tracking-widest text-indigo uppercase mb-3">
            {hero.eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {hero.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            {hero.subtitle}
          </p>
        </div>
      </div>

      {/* Programs grid */}
      <section className="py-16" style={{ background: "#0a1018" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card) => (
              <ProgramCard key={card.id} program={card} />
            ))}
          </div>
        </div>
      </section>

      {/* Coach strip */}
      <section className="py-16" style={{ background: "#070d17" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="המאמנים שלנו"
            title="מוסמכים. מנוסים. מסורים."
            subtitle="כל קבוצה מונהגת על ידי מאמן בעל רישיון בינלאומי ותשוקה לפיתוח שחקנים."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "עמית לוי", role: "מאמן U9", license: "UEFA C" },
              { name: "יוסי כהן", role: "מאמן U12", license: "UEFA B" },
              { name: "רון אברהם", role: "מאמן U15", license: "UEFA B" },
              { name: "דני פרץ", role: "מאמן U17", license: "UEFA A" },
            ].map((coach) => (
              <div
                key={coach.name}
                className="rounded-2xl p-6 text-center transition-all"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.15)" }}
                >
                  <span className="text-indigo text-xl font-black">
                    {coach.name[0]}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm">{coach.name}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{coach.role}</p>
                <span
                  className="inline-block mt-2.5 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}
                >
                  {coach.license}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-12"
        style={{ background: "#0a1018", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-lg mb-4">
            לא בטוחים לאיזו תוכנית להצטרף?
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center px-7 py-3.5 text-white font-bold rounded-xl transition-all hover:opacity-80"
            style={{ background: "#6366f1" }}
          >
            דברו איתנו – נעזור לבחור
          </Link>
        </div>
      </section>
    </>
  );
}
