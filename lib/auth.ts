export interface AuthUser {
  id: string;
  fullName: string;
  email?: string;
  cpf?: string;
  isAdmin?: boolean;
}

export interface AuthResponse {
  message?: string;
  user: AuthUser;
}

export const setAuthToken = (token: string) => {
  // Now using Cookies from API, so this is just for manual/client overrides if needed,
  // but let's keep it for compatibility if any other logic uses it.
  // Although the new approach is cookie-based and handled by the browser.
};

export const getAuthToken = (): string | null => {
  // Since we're using HttpOnly cookies, we can't access them via JS.
  // We'll need to check authentication status by calling /api/auth/me
  return null;
};

export const removeAuthToken = () => {
  // Logout is now handled by the /api/auth/logout endpoint
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
};
