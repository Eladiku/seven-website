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
      <div className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-sm font-semibold tracking-widest text-green uppercase mb-3">
            {hero.eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {hero.title}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {hero.subtitle}
          </p>
        </div>
      </div>

      {/* Programs grid */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cards.map((card) => (
              <ProgramCard key={card.id} program={card} />
            ))}
          </div>
        </div>
      </section>

      {/* Coach strip */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="המאמנים שלנו"
            title="מוסמכים. מנוסים. מסורים."
            subtitle="כל קבוצה מונהגת על ידי מאמן בעל רישיון בינלאומי ותשוקה לפיתוח שחקנים."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "עמית לוי", role: "מאמן U9", license: "UEFA C" },
              { name: "יוסי כהן", role: "מאמן U12", license: "UEFA B" },
              { name: "רון אברהם", role: "מאמן U15", license: "UEFA B" },
              { name: "דני פרץ", role: "מאמן U17", license: "UEFA A" },
            ].map((coach) => (
              <div
                key={coach.name}
                className="bg-light rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-navy rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-green text-2xl font-black">
                    {coach.name[0]}
                  </span>
                </div>
                <h3 className="font-bold text-navy">{coach.name}</h3>
                <p className="text-muted text-sm mt-0.5">{coach.role}</p>
                <span className="inline-block mt-2 text-xs bg-green/10 text-green font-semibold px-3 py-1 rounded-full">
                  {coach.license}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-light border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-navy font-semibold text-lg mb-4">
            לא בטוחים לאיזו תוכנית להצטרף?
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center px-7 py-3.5 bg-green text-navy font-bold rounded-xl hover:bg-green-600 transition-colors"
          >
            דברו איתנו – נעזור לבחור
          </Link>
        </div>
      </section>
    </>
  );
}
