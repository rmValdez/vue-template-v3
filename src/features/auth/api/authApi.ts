import { http } from '@/shared/api/http';
import { ENDPOINTS } from '@/shared/api/endpoints';
import {
  AuthResponseSchema,
  UserSchema,
  type AuthResponse,
  type LoginCredentials,
  type RegisterCredentials,
  type User
} from '../model/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const data = await http.post<AuthResponse>(ENDPOINTS.auth.login, credentials, {
      requiresAuth: false
    });
    return AuthResponseSchema.parse(data);
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const data = await http.post<AuthResponse>(ENDPOINTS.auth.register, credentials, {
      requiresAuth: false
    });
    return AuthResponseSchema.parse(data);
  },

  getCurrentUser: async (): Promise<User> => {
    const data = await http.get<User>(ENDPOINTS.auth.me);
    return UserSchema.parse(data);
  },

  logout: async (): Promise<void> => {
    await http.post(ENDPOINTS.auth.logout);
  }
};
