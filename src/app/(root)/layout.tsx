"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { userSelector } from "@/store/slices/userSlice";
import { useSelector } from "react-redux";
import { logout, verifyUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/hooks/providers";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSelector(userSelector);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(verifyUser());
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64 p-8">{children}</main>
    </div>
  );
}
