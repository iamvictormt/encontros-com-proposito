export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
    },
  },
  timeout: 10000,
} as const;
