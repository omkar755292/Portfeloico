"use client";

import { AuthProtectedRoutes } from "@/components/ProtectedRoutes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProtectedRoutes>
            <div className="min-h-screen bg-background">
                <main>{children}</main>
            </div>
        </AuthProtectedRoutes>
    );
}
