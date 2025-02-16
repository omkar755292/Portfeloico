import { useAppDispatch, useAppSelector } from "@/hooks/providers";
import { userSelector, verifyToken } from "@/store/slices/userSlice";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Loading from "../custom/Loading";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAppSelector(userSelector);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(verifyToken());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated && !isLoading && pathname === "/login") {
            router.replace("/");
            return;
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    if (isLoading) {
        return <Loading />;
    }

    // Don't show login page content while checking authentication
    if (pathname === "/login" && (isLoading || isAuthenticated)) {
        return <Loading />;
    }

    return children;
};

export default AuthProvider;
