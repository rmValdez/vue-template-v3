import { http } from '@/shared/api/http';
import { tokenStorage } from '@/shared/api/token';
import { ENDPOINTS } from '@/shared/api/endpoints';
import {
  AuthResponseSchema,
  UserSchema,
  type ApiResponse,
  type AuthResponse,
  type LoginCredentials,
  type RegisterCredentials,
  type User
} from '../model/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await http.post<ApiResponse<AuthResponse>>(ENDPOINTS.auth.login, credentials, {
      requiresAuth: false
    });
    return AuthResponseSchema.parse(res.data);
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const res = await http.post<ApiResponse<AuthResponse>>(ENDPOINTS.auth.register, credentials, {
      requiresAuth: false
    });
    return AuthResponseSchema.parse(res.data);
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await http.get<ApiResponse<User>>(ENDPOINTS.auth.me);
    return UserSchema.parse(res.data);
  },

  refreshToken: async (token?: string): Promise<AuthResponse> => {
    const refreshToken = token || tokenStorage.getRefreshToken();
    const res = await http.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.auth.refresh,
      { refreshToken },
      { requiresAuth: false }
    );
    return AuthResponseSchema.parse(res.data);
  },

  logout: async (): Promise<void> => {
    try {
      await http.post(ENDPOINTS.auth.logout);
    } catch {
      // Ignore network errors on logout
    }
  }
};
