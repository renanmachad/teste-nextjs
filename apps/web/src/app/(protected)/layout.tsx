"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/admin/login");
        } else {
            setIsChecking(false);
        }
    }, [router]);

    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-muted-foreground">Verificando autenticação...</div>
            </div>
        );
    }

    return <>{children}</>;
}