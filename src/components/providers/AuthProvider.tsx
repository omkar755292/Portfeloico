"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/providers";
import { userSelector, verifyToken } from "@/store/slices/userSlice";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Loading from "../custom/Loading";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAppSelector(userSelector);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const verificationAttempted = useRef(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (verificationAttempted.current) return;
      verificationAttempted.current = true;

      try {
        await dispatch(verifyToken()).unwrap();
        setHasCheckedAuth(true);
      } catch {
        setHasCheckedAuth(true);
        if (pathname !== "/login") router.push("/login");
      }
    };

    initAuth();
  }, [dispatch, pathname, router]);

  useEffect(() => {
    if (!isLoading && hasCheckedAuth) {
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login");
      } else if (isAuthenticated && pathname === "/login") {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, hasCheckedAuth, pathname, router]);

  return children;
};

export default AuthProvider;
