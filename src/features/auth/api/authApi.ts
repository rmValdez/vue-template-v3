import { http } from '@/shared/api/http';
import { tokenStorage } from '@/shared/api/token';
import { ENDPOINTS } from '@/shared/api/endpoints';
import {
  AuthResponseSchema,
  UserSchema,
  type AuthResponse,
  type LoginCredentials,
  type RegisterCredentials,
  type User
} from '../model/types';

interface AuthPayload {
  data?: {
    user?: { role?: string };
    accessToken?: string;
    refreshToken?: string;
  };
  user?: { role?: string };
  role?: string;
  accessToken?: string;
  refreshToken?: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const rawData = await http.post<AuthPayload>(ENDPOINTS.auth.login, credentials, {
      requiresAuth: false
    });
    const payload = (rawData?.data || rawData) as { user?: { role?: string } };
    if (payload?.user?.role) {
      const rawRole = String(payload.user.role).toLowerCase();
      payload.user.role = rawRole === 'super_admin' || rawRole === 'admin' ? 'admin' : 'member';
    }
    return AuthResponseSchema.parse(payload);
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const rawData = await http.post<AuthPayload>(ENDPOINTS.auth.register, credentials, {
      requiresAuth: false
    });
    const payload = (rawData?.data || rawData) as { user?: { role?: string } };
    if (payload?.user?.role) {
      const rawRole = String(payload.user.role).toLowerCase();
      payload.user.role = rawRole === 'super_admin' || rawRole === 'admin' ? 'admin' : 'member';
    }
    return AuthResponseSchema.parse(payload);
  },

  getCurrentUser: async (): Promise<User> => {
    const rawData = await http.get<AuthPayload>(ENDPOINTS.auth.me);
    const payload = (rawData?.data || rawData) as { role?: string };
    if (payload?.role) {
      const rawRole = String(payload.role).toLowerCase();
      payload.role = rawRole === 'super_admin' || rawRole === 'admin' ? 'admin' : 'member';
    }
    return UserSchema.parse(payload);
  },

  refreshToken: async (token?: string): Promise<AuthResponse> => {
    const refreshToken = token || tokenStorage.getRefreshToken();
    const rawData = await http.post<AuthPayload>(
      ENDPOINTS.auth.refresh,
      { refreshToken },
      { requiresAuth: false }
    );
    const payload = (rawData?.data || rawData) as { user?: { role?: string } };
    if (payload?.user?.role) {
      const rawRole = String(payload.user.role).toLowerCase();
      payload.user.role = rawRole === 'super_admin' || rawRole === 'admin' ? 'admin' : 'member';
    }
    return AuthResponseSchema.parse(payload);
  },

  logout: async (): Promise<void> => {
    try {
      await http.post(ENDPOINTS.auth.logout);
    } catch {
      // Ignore network errors on logout
    }
  }
};
