export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  endpoints: {
    auth: {
      login: "/api/auth/login",
      register: "/api/auth/register",
      logout: "/api/auth/logout",
      me: "/api/auth/me",
    },
  },
  timeout: 10000,
} as const;
