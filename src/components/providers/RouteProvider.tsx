import { useAppDispatch, useAppSelector } from "@/hooks/providers";
import { userSelector, verifyToken } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../custom/Loading";

const RouteProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAppSelector(userSelector);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(verifyToken());
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            router.replace("/login");
            return;
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !isAuthenticated) {
        return <Loading />;
    }

    return children;
}

export default RouteProvider
