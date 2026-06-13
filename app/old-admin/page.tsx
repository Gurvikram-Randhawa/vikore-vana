import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin (Legacy)"
};

export default function OldAdminPage() {
  return <AdminDashboard />;
}
