import Link from "next/link";
import type { PricingPlan } from "@/data/pricing";

interface PricingCardProps {
  plan: PricingPlan;
  highlighted?: boolean;
}

export default function PricingCard({ plan, highlighted = false }: PricingCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={
        highlighted
          ? {
              background: "#0e1520",
              border: "1px solid rgba(99,102,241,0.4)",
              boxShadow: "0 0 40px rgba(99,102,241,0.12)",
              transform: "scale(1.03)",
            }
          : {
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }
      }
    >
      {highlighted && (
        <div
          className="text-xs font-black text-center py-2 tracking-widest uppercase"
          style={{ background: "#6366f1", color: "#fff" }}
        >
          הכי פופולרי
        </div>
      )}

      <div className="p-7">
        <h3 className="text-base font-bold text-white mb-1">
          {plan.ageGroup}
        </h3>

        <div className="my-5">
          <span
            className="text-4xl font-black"
            style={{ color: highlighted ? "#818cf8" : "#fff" }}
          >
            ₪{plan.pricePerCard}
          </span>
          <span className="text-sm mr-1 text-gray-500">לכרטיסיה</span>
        </div>

        <div
          className="text-sm text-gray-500 mb-6 pb-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          ₪{plan.pricePerSession} לאימון · {plan.sessionsPerCard} כניסות
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <span className="text-green font-bold">✓</span>
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/#contact"
          className="block w-full text-center py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-80"
          style={{ background: "#6366f1" }}
        >
          רכוש כרטיסייה
        </Link>
      </div>
    </div>
  );
}
