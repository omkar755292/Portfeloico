import { useAppSelector } from "@/hooks/providers";
import { userSelector } from "@/store/slices/userSlice";
import { useRouter, usePathname } from "next/navigation";

export const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAppSelector(userSelector);
  const router = useRouter();

  if (!isAuthenticated) {
    router.replace("/login");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-500">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return children;
};

export const AuthProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAppSelector(userSelector);
  const router = useRouter();
  const pathname = usePathname();

  if (isAuthenticated && pathname === "/login") {
    router.replace("/");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return children;
};
