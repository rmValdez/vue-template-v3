import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../model/authStore';
import { authApi } from '../api/authApi';
import { tokenStorage } from '@/shared/api/token';

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    tokenStorage.clearTokens();
    vi.restoreAllMocks();
  });

  it('initializes with default unauthenticated state', () => {
    const authStore = useAuthStore();
    expect(authStore.user).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.role).toBe('guest');
  });

  it('logs in successfully and sets token and user state', async () => {
    const mockUser = {
      id: 'usr_1',
      name: 'System Admin',
      email: 'admin@example.com',
      role: 'admin' as const
    };

    vi.spyOn(authApi, 'login').mockResolvedValueOnce({
      user: mockUser,
      accessToken: 'mock_jwt_access_token',
      refreshToken: 'mock_jwt_refresh_token'
    });

    const authStore = useAuthStore();
    await authStore.login({
      email: 'admin@example.com',
      password: 'Password123!'
    });

    expect(authStore.user).toEqual(mockUser);
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.role).toBe('admin');
    expect(tokenStorage.getAccessToken()).toBe('mock_jwt_access_token');
  });

  it('logs out and clears user state and tokens', async () => {
    const mockUser = {
      id: 'usr_1',
      name: 'System Admin',
      email: 'admin@example.com',
      role: 'admin' as const
    };

    vi.spyOn(authApi, 'login').mockResolvedValueOnce({
      user: mockUser,
      accessToken: 'mock_jwt_access_token',
      refreshToken: 'mock_jwt_refresh_token'
    });
    vi.spyOn(authApi, 'logout').mockResolvedValueOnce();

    const authStore = useAuthStore();
    await authStore.login({
      email: 'admin@example.com',
      password: 'Password123!'
    });
    expect(authStore.isAuthenticated).toBe(true);

    await authStore.logout();
    expect(authStore.user).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
    expect(tokenStorage.hasToken()).toBe(false);
  });
});
