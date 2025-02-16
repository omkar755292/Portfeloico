"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import ApiService from "@/utils/ApiService";
import { API } from "@/utils/Api";

interface LoginCredentials {
  Email: string;
  Password: string;
}

interface IUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthResponse {
  user: IUser;
  message?: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ApiService.get<AuthResponse>(API.auth.verify, {
        withCredentials: true
      });

      if (res.status === 200 && res.data.user) {
        setIsAuthenticated(true);
        setUser(res.data.user);
        if (pathname === "/login") {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Authentication Error:", error);
      setIsAuthenticated(false);
      setUser(null);
      if (pathname !== "/login") {
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router, pathname]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const res = await ApiService.post<AuthResponse>(
        API.auth.login,
        credentials
      );

      if (res.status === 200 && res.data.user) {
        setIsAuthenticated(true);
        setUser(res.data.user);
        router.replace("/");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await ApiService.post(API.auth.logout);
      setIsAuthenticated(false);
      setUser(null);
      router.replace("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth,
  };
}
