"use client";

import { useAuth } from "@/app/providers/auth-provider";

export default function HomePage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>Carregando...</div>
            </div>
        );
    }

    return (
        <div>
            <h2>Página inicial</h2>
            {user && (
                <div>
                    <p>Bem-vindo, {user.name}!</p>
                    <p>Email: {user.email}</p>
                </div>
            )}
        </div>
    );
}