import { z } from 'zod';

export const UserRoleSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    const raw = val.toLowerCase().trim();
    if (raw === 'super_admin' || raw === 'admin') return 'admin';
    if (raw === 'manager') return 'manager';
    if (raw === 'developer') return 'admin';
    if (raw === 'user' || raw === 'member') return 'member';
    if (raw === 'guest' || raw === 'viewer') return 'guest';
  }
  return val;
}, z.enum(['admin', 'manager', 'member', 'guest'] as const));

export const UserItemSchema = z.object({
  id: z.string(),
  name: z.string().nullable().transform(val => val || 'User'),
  email: z.string().email(),
  role: UserRoleSchema,
  status: z.preprocess((val) => {
    if (typeof val === 'boolean') return val ? 'active' : 'inactive';
    if (typeof val === 'string') return val.toLowerCase();
    return 'active';
  }, z.enum(['active', 'inactive', 'pending'] as const)).default('active'),
  avatar: z.string().optional(),
  createdAt: z.string().optional().default(() => new Date().toISOString()),
  permissions: z.array(z.string()).default([])
});

export type UserItem = z.infer<typeof UserItemSchema>;

export const UserListSchema = z.array(UserItemSchema);
export type UserList = z.infer<typeof UserListSchema>;

export const UpdateRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(['admin', 'manager', 'member', 'guest'] as const)
});

export type UpdateRolePayload = z.infer<typeof UpdateRoleSchema>;
