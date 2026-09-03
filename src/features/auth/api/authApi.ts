import { http } from '@/shared/api/http';
import { tokenStorage } from '@/shared/api/token';
import { ENDPOINTS } from '@/shared/api/endpoints';
import {
  AuthResponseSchema,
  RefreshResponseSchema,
  UserSchema,
  type AuthResponse,
  type LoginCredentials,
  type RefreshResponse,
  type RegisterCredentials,
  type User
} from '../model/types';

// nuxt-template-v2's auth endpoints return the payload flat
// ({ user, accessToken, refreshToken }), not wrapped in a `data` envelope —
// unlike this client's generic `ApiResponse<T>` convention used elsewhere.
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await http.post<any>(
      ENDPOINTS.auth.login,
      credentials,
      {
        requiresAuth: false
      }
    );
    const payload = res?.data ?? res;
    return AuthResponseSchema.parse(payload);
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const res = await http.post<any>(
      ENDPOINTS.auth.register,
      credentials,
      {
        requiresAuth: false
      }
    );
    const payload = res?.data ?? res;
    return AuthResponseSchema.parse(payload);
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await http.get<any>(ENDPOINTS.auth.me);
    const payload = res?.data ?? res;
    return UserSchema.parse(payload);
  },

  refreshToken: async (token?: string): Promise<RefreshResponse> => {
    const refreshToken = token || tokenStorage.getRefreshToken();
    const res = await http.post<any>(
      ENDPOINTS.auth.refresh,
      { refreshToken },
      { requiresAuth: false }
    );
    const payload = res?.data ?? res;
    return RefreshResponseSchema.parse(payload);
  },

  logout: async (): Promise<void> => {
    try {
      await http.post(ENDPOINTS.auth.logout);
    } catch {
      // Ignore network errors on logout
    }
  }
};
