import { useAppSelector, useAppDispatch } from "@/hooks/providers";
import { userSelector, verifyToken } from "@/store/slices/userSlice";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Loading from "./Loading";

export const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAppSelector(userSelector);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(verifyToken());
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            router.replace("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <Loading />
        );
    }

    return children;
};

export const AuthProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAppSelector(userSelector);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        dispatch(verifyToken());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated && !isLoading && pathname === "/login") {
            router.replace("/");
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    if (isLoading) {
        <Loading />
    }

    return children;
};
