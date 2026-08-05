import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/authentication/auth.store';
import { authService } from '@/services/auth.service';

export function useAuth() {
  const router = useRouter();
  const store = useAuthStore();

  async function login(email: string, password: string) {
    const { accessToken, refreshToken } =
      await authService.login({ email, password });

    store.setTokens(accessToken, refreshToken);

    const user = await authService.me(accessToken);
    store.setUser(user);

    router.push('/dashboard');
  }

  async function logout() {
    if (store.refreshToken) {
      await authService.logout(store.refreshToken).catch(() => {});
    }
    store.clear();
    router.push('/login');
  }

  return {
    user: store.user,
    accessToken: store.accessToken,
    isAuthenticated: store.isAuthenticated(),
    hasRole: store.hasRole,
    login,
    logout,
  };
}