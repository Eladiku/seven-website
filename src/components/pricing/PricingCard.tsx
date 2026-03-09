import Link from "next/link";
import type { PricingPlan } from "@/data/pricing";

interface PricingCardProps {
  plan: PricingPlan;
  highlighted?: boolean;
}

export default function PricingCard({ plan, highlighted = false }: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all ${
        highlighted
          ? "bg-navy text-white shadow-2xl scale-105 ring-2 ring-green"
          : "bg-white text-navy border border-gray-100 shadow-sm hover:shadow-md"
      }`}
    >
      {highlighted && (
        <div className="bg-green text-navy text-xs font-black text-center py-2 tracking-widest uppercase">
          הכי פופולרי
        </div>
      )}

      <div className="p-8">
        <h3
          className={`text-lg font-bold mb-1 ${highlighted ? "text-white" : "text-navy"}`}
        >
          {plan.ageGroup}
        </h3>

        <div className="my-5">
          <span className={`text-4xl font-black ${highlighted ? "text-green" : "text-navy"}`}>
            ₪{plan.pricePerCard}
          </span>
          <span className={`text-sm mr-1 ${highlighted ? "text-gray-300" : "text-muted"}`}>
            לכרטיסיה
          </span>
        </div>

        <div
          className={`text-sm mb-6 pb-6 border-b ${
            highlighted ? "text-gray-300 border-navy-700" : "text-muted border-gray-100"
          }`}
        >
          ₪{plan.pricePerSession} לאימון · {plan.sessionsPerCard} כניסות
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <span className="text-green font-bold">✓</span>
              <span className={highlighted ? "text-gray-200" : "text-navy"}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-colors ${
            highlighted
              ? "bg-green text-navy hover:bg-green-600"
              : "bg-navy text-white hover:bg-green hover:text-navy"
          }`}
        >
          רכוש כרטיסייה
        </Link>
      </div>
    </div>
  );
}
