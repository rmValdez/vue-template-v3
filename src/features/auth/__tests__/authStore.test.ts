import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../model/authStore';
import { tokenStorage } from '@/shared/api/token';

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    tokenStorage.clearTokens();
  });

  it('initializes with default unauthenticated state', () => {
    const authStore = useAuthStore();
    expect(authStore.user).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.role).toBe('guest');
  });

  it('logs in successfully and sets token and user state', async () => {
    const authStore = useAuthStore();
    await authStore.login({
      email: 'admin@example.com',
      password: 'password123'
    });

    expect(authStore.user).not.toBeNull();
    expect(authStore.user?.email).toBe('admin@example.com');
    expect(authStore.isAuthenticated).toBe(true);
    expect(tokenStorage.hasToken()).toBe(true);
  });

  it('logs out and clears user state and tokens', async () => {
    const authStore = useAuthStore();
    await authStore.login({
      email: 'admin@example.com',
      password: 'password123'
    });
    expect(authStore.isAuthenticated).toBe(true);

    authStore.logout();
    expect(authStore.user).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
    expect(tokenStorage.hasToken()).toBe(false);
  });
});
