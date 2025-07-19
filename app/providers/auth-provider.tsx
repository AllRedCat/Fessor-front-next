"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { authAPI } from "@/app/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rotas que não precisam de autenticação
const publicRoutes = ["/login", "/register"];

// Rotas que precisam de autenticação
const protectedRoutes = ["/home", "/history", "/profile"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const loadUserFromCookies = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Endpoint correto para buscar o usuário logado
      const data = await authAPI.me();
      if (data) {
        setUser(data);
        console.log("Usuário carregado com sucesso:", data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("No active session or error loading user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Gerenciamento automático de rotas baseado na autenticação
  useEffect(() => {
    if (!isLoading) {
      const isAuthenticated = !!user;
      const isPublicRoute = publicRoutes.includes(pathname);
      const isProtectedRoute = protectedRoutes.includes(pathname);
      const isRootRoute = pathname === "/";

      if (isRootRoute) {
        // Página raiz: redireciona baseado na autenticação
        if (isAuthenticated) {
          router.push("/home");
        } else {
          router.push("/login");
        }
      } else if (isProtectedRoute && !isAuthenticated) {
        // Tentativa de acessar rota protegida sem autenticação
        router.push("/login");
      } else if (isPublicRoute && isAuthenticated) {
        // Usuário autenticado tentando acessar página de login/registro
        router.push("/home");
      }
    }
  }, [isLoading, user, pathname, router]);

  useEffect(() => {
    loadUserFromCookies();
  }, [loadUserFromCookies]);

  const login = async (data: any) => {
    try {
      console.log("Attempting login with data:", data);
      const response = await authAPI.login(data);
      console.log("Login response:", response);
      
      // Se a resposta for null ou vazia, considerar como sucesso
      // (alguns servidores não retornam dados no login, apenas definem cookies)
      await loadUserFromCookies(); // Carrega os dados do usuário após o login
      // O redirecionamento será feito automaticamente pelo useEffect acima
    } catch (error: any) {
      console.error("Erro no login:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
      }
      throw error;
    }
  };

  const register = async (data: any) => {
    await authAPI.register(data);
    router.push("/login");
  };

  const logout = async () => {
    try {
      // Endpoint para fazer logout no backend e limpar o cookie
      await authAPI.logout();
    } catch (error) {
        console.error("Logout failed", error)
    } finally {
        setUser(null);
        router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, isLoading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 