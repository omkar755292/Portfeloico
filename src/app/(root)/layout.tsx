"use client";

import { Sidebar } from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { useAppSelector } from "@/hooks/providers";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useAppSelector((state) => state.sidebar);
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      <main
        className={cn("p-8 transition-all duration-300", isCollapsed ? "md:ml-16" : "md:ml-64")}
      >
        {children}
      </main>
    </div>
  );
}
