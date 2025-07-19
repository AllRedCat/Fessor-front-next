"use client";

import { usePathname } from "next/navigation";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();
  
  // Verificar se está em uma página de autenticação
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  // Se estiver em página de auth, não adicionar margem da sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Para outras páginas, adicionar margem da sidebar e padding
  return (
    <div className="md:ml-64 pt-4 md:pt-8">
      {children}
    </div>
  );
} 