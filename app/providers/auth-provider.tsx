"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const api = axios.create({
  baseURL: "https://192.168.15.10:5006",
  withCredentials: true, // Permite que o axios envie cookies
});

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: any) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const loadUserFromCookies = useCallback(async () => {
    try {
      // Endpoint para buscar o usuário logado, usando o cookie de sessão
      const { data } = await api.get("/auth/me");
      if (data) setUser(data);
    } catch (error) {
      console.log("No active session");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadUserFromCookies();
  }, [loadUserFromCookies]);

  const login = async (data: any) => {
    await api.post("/auth/login", data);
    await loadUserFromCookies(); // Carrega os dados do usuário após o login
    router.push("/home");
  };

  const register = async (data: any) => {
    await api.post("/api/Users", data);
    router.push("/login");
  };

  const logout = async () => {
    try {
      // Endpoint para fazer logout no backend e limpar o cookie
      await api.post("/auth/logout");
    } catch (error) {
        console.error("Logout failed", error)
    } finally {
        setUser(null);
        router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, logout, register }}
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