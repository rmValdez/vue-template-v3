import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { tokenStorage } from '@/shared/api/token';
import { rbac } from '@/shared/auth/rbac';
import type { Permission, Role } from '@/shared/auth/permissions';
import { authApi } from '../api/authApi';
import type { LoginCredentials, RegisterCredentials, User } from './types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref<boolean>(false);
  const isInitialized = ref<boolean>(false);

  const isAuthenticated = computed(() => !!user.value && tokenStorage.hasToken());
  const role = computed<Role>(() => user.value?.role || 'guest');

  async function login(credentials: LoginCredentials): Promise<void> {
    isLoading.value = true;
    try {
      const response = await authApi.login(credentials);
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      user.value = response.user;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(credentials: RegisterCredentials): Promise<void> {
    isLoading.value = true;
    try {
      const response = await authApi.register(credentials);
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      user.value = response.user;
    } finally {
      isLoading.value = false;
    }
  }

  function logout(): void {
    tokenStorage.clearTokens();
    user.value = null;
  }

  async function refreshSession(): Promise<boolean> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await authApi.refreshToken();
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      user.value = response.user;
      return true;
    } catch {
      logout();
      return false;
    }
  }

  async function initAuth(): Promise<void> {
    if (isInitialized.value) return;

    if (tokenStorage.hasToken()) {
      try {
        isLoading.value = true;
        const currentUser = await authApi.getCurrentUser();
        user.value = currentUser;
      } catch (error) {
        const refreshed = await refreshSession();
        if (!refreshed) {
          console.warn('Failed to restore user session:', error);
          logout();
        }
      } finally {
        isLoading.value = false;
      }
    }

    isInitialized.value = true;
  }

  function hasPermission(permission: Permission): boolean {
    return rbac.hasPermission(role.value, permission);
  }

  function canAccessRoute(allowedRoles?: Role[]): boolean {
    return rbac.canAccessRoute(role.value, allowedRoles);
  }

  return {
    user,
    role,
    isLoading,
    isInitialized,
    isAuthenticated,
    login,
    register,
    logout,
    refreshSession,
    initAuth,
    hasPermission,
    canAccessRoute
  };
});
