"use client";

import AuthProvider from "@/components/providers/AuthProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-background">
                <main>{children}</main>
            </div>
        </AuthProvider>
    );
}
