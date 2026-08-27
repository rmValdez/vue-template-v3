import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'member', 'guest'] as const),
  avatar: z.string().optional()
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
