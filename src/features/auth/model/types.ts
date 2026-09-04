import { z } from 'zod';

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export const UserRoleSchema = z.preprocess(
  val => {
    if (typeof val === 'string') {
      const raw = val.toLowerCase().trim();
      if (raw === 'super_admin' || raw === 'admin') return 'admin';
      if (raw === 'manager') return 'manager';
      if (raw === 'developer') return 'admin';
      if (raw === 'user' || raw === 'member') return 'member';
      if (raw === 'guest' || raw === 'viewer') return 'guest';
    }
    return val;
  },
  z.enum(['admin', 'manager', 'member', 'guest'] as const)
);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  role: UserRoleSchema,
  avatar: z.string().optional(),
  permissions: z.array(z.string()).default([])
});

export type User = z.infer<typeof UserSchema>;

export const LoginCredentialsSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

export const RegisterCredentialsSchema = LoginCredentialsSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword']
});

export type RegisterCredentials = z.infer<typeof RegisterCredentialsSchema>;

export const AuthResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string().optional()
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// nuxt-template-v2's POST /api/auth/refresh returns only the tokens, no
// `user` — unlike login/register, which return the full AuthResponse shape.
export const RefreshResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional()
});

export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;
