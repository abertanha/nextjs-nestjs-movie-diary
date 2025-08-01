'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    console.log('[ProtectedRoute] Renderizando com estado:', { isLoading, isAuthenticated });

    useEffect(() => {
        // we should wait for the authprovider loading to finish
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) return <LoadingSpinner />;

    if (isAuthenticated) return <>{children}</>;

    return <LoadingSpinner />;
}