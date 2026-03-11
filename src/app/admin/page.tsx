import AdminShell from "@/components/admin/AdminShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "אזור ניהול | Seven Academy",
  description: "ניהול אימונים ונרשמים.",
};

export default function AdminPage() {
  return <AdminShell />;
}
