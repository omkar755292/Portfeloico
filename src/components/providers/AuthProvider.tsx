import { useAppDispatch, useAppSelector } from "@/hooks/providers";
import { userSelector, verifyToken } from "@/store/slices/userSlice";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Loading from "../custom/Loading";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAppSelector(userSelector);
    const [isInitializing, setIsInitializing] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const verificationAttempted = useRef(false);

    useEffect(() => {
        const initAuth = async () => {
            // Skip if verification was already attempted
            if (verificationAttempted.current) {
                setIsInitializing(false);
                return;
            }

            try {
                // Mark that we've attempted verification
                verificationAttempted.current = true;

                // Verify token on initial load and set up periodic verification
                await dispatch(verifyToken()).unwrap();

                // Set up periodic verification every 5 minutes
                const intervalId = setInterval(async () => {
                    try {
                        await dispatch(verifyToken()).unwrap();
                    } catch (error) {
                        // If verification fails, clear interval and redirect to login
                        clearInterval(intervalId);
                        if (pathname !== "/login") {
                            router.replace("/login");
                        }
                    }
                }, 5 * 1000); // 5 seconds

                // Cleanup interval on unmount
                return () => clearInterval(intervalId);
            } catch (error) {
                // Handle initial verification failure
                if (pathname !== "/login") {
                    router.replace("/login");
                }
            } finally {
                setIsInitializing(false);
            }
        };
        initAuth();
    }, [dispatch]);

    useEffect(() => {
        if (!isInitializing && isAuthenticated && pathname === "/login") {
            router.replace("/");
        }
    }, [isAuthenticated, isInitializing, pathname, router]);

    // Show loading during initial auth check or when explicitly loading
    if (isInitializing || isLoading) {
        return <Loading />;
    }

    return children;
};

export default AuthProvider;
