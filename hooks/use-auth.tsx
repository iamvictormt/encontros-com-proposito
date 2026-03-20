'use client';

import { authClient } from '@/lib/auth/client';

export function useAuth() {
  const { data: session, isPending: isLoading } = authClient.useSession();

  const logout = async () => {
    await authClient.signOut();
  };

  return {
    isLoggedIn: !!session,
    isLoading,
    logout,
    user: session?.user,
    session: session?.session,
  };
}
