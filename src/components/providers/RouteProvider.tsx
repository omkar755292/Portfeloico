import { useAppSelector } from "@/hooks/providers";
import { userSelector } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../custom/Loading";

const RouteProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAppSelector(userSelector);
    const router = useRouter();
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setHasCheckedAuth(true);
            if (!isAuthenticated) {
                router.replace("/login");
            }
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading while authentication status is being checked
    if (isLoading || !hasCheckedAuth) {
        return <Loading />;
    }

    return children;
};

export default RouteProvider;
