import DashboardShell from "@/components/dashboard/DashboardShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "אזור אישי | Seven Academy",
  description: "ניהול ילדים, כרטיסיות ואימונים באקדמיית Seven.",
};

export default function DashboardPage() {
  return <DashboardShell />;
}
