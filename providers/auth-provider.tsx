"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { isAuthenticated } from "@/lib/auth";
import { authService, AuthUser } from "@/lib/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const isAuth = await isAuthenticated();
      setIsLoggedIn(isAuth);
      if (isAuth) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setUser(null);
      toast.success("Logout realizado com sucesso");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erro ao sair");
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isLoading, logout, refreshAuth: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
