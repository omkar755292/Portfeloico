"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { ProtectedRoutes } from "@/components/ProtectedRoutes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoutes>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="md:ml-64 p-8">{children}</main>
      </div>
    </ProtectedRoutes>
  );
}
