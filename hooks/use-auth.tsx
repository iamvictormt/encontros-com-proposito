'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated, getAuthToken, removeAuthToken } from '@/lib/auth';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      setIsLoggedIn(authStatus);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const logout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    isLoading,
    logout,
    token: getAuthToken(),
  };
}
