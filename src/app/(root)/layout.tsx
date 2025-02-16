"use client";

import { Sidebar } from "@/components/layout/sidebar";
import RouteProvider from "@/components/providers/RouteProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="md:ml-64 p-8">{children}</main>
      </div>
    </RouteProvider>
  );
}
