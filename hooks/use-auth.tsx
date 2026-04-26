"use client";

import { useState, useEffect, useCallback } from "react";
import { isAuthenticated } from "@/lib/auth";
import { authService, AuthUser } from "@/lib/services/auth.service";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export function useAuth() {
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

  return {
    isLoggedIn,
    user,
    isLoading,
    logout,
    refreshAuth: checkAuth,
  };
}
