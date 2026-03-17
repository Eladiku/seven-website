import ProgramsShell from "@/components/programs/ProgramsShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "תוכניות אימון | Seven Academy",
  description:
    "תוכניות אימון כדורגל מקצועיות לגילאי 8–17. 4 קבוצות גיל עם אימונים מותאמים אישית.",
};

export default function ProgramsPage() {
  return <ProgramsShell />;
}
