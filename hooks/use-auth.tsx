'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated, getAuthToken, removeAuthToken } from '@/lib/auth';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setIsLoading(false);
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
