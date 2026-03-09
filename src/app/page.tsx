import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ValuesSection from "@/components/home/ValuesSection";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ValuesSection />

      {/* CTA Banner */}
      <section className="bg-green py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-navy mb-4">
            מוכנים להתחיל?
          </h2>
          <p className="text-navy/70 text-lg mb-8">
            הצטרפו לעשרות משפחות שכבר בחרו ב-Seven. מקומות מוגבלים בכל קבוצה.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/schedule"
              className="px-8 py-4 bg-navy text-white font-bold text-lg rounded-xl hover:bg-navy-800 transition-colors"
            >
              ראה לוח אימונים
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-navy font-bold text-lg rounded-xl hover:bg-gray-50 transition-colors"
            >
              הירשם עכשיו
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
