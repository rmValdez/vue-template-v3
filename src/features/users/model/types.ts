import { z } from 'zod';

export const UserItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'member', 'guest'] as const),
  status: z.enum(['active', 'inactive', 'pending'] as const),
  avatar: z.string().optional(),
  createdAt: z.string()
});

export type UserItem = z.infer<typeof UserItemSchema>;

export const UserListSchema = z.array(UserItemSchema);
export type UserList = z.infer<typeof UserListSchema>;

export const UpdateRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(['admin', 'manager', 'member', 'guest'] as const)
});

export type UpdateRolePayload = z.infer<typeof UpdateRoleSchema>;
