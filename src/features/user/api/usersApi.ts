import { useQueryClient } from '@tanstack/vue-query';
import { http } from '@/shared/api/http';
import { ENDPOINTS } from '@/shared/api/endpoints';
import { useSafeQuery } from '@/shared/query/useSafeQuery';
import { useSafeMutation } from '@/shared/query/useSafeMutation';
import {
  UserListSchema,
  UserItemSchema,
  type UserList,
  type UserItem,
  type UpdateRolePayload
} from '../model/types';

interface UsersResponseEnvelope {
  data?: {
    items?: unknown[];
    users?: unknown[];
  };
  items?: unknown[];
  users?: unknown[];
}

export const usersApi = {
  getUsers: async (): Promise<UserList> => {
    const res = await http.get<UsersResponseEnvelope>(ENDPOINTS.users.list);
    const rawList = res?.data?.items ?? res?.data?.users ?? res?.items ?? res?.users ?? res?.data ?? res ?? [];
    return UserListSchema.parse(rawList);
  },

  updateUserRole: async (payload: UpdateRolePayload): Promise<UserItem> => {
    const data = await http.patch<UserItem>(ENDPOINTS.users.updateRole(payload.userId), {
      role: payload.role
    });
    return UserItemSchema.parse(data);
  }
};

export function useUsersQuery() {
  return useSafeQuery({
    queryKey: ['users', 'list'],
    queryFn: usersApi.getUsers,
    schema: UserListSchema
  });
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();

  return useSafeMutation({
    mutationFn: usersApi.updateUserRole,
    schema: UserItemSchema,
    onSuccess: updatedUser => {
      queryClient.setQueryData<UserList>(['users', 'list'], old => {
        if (!old) return [updatedUser];
        return old.map(u => (u.id === updatedUser.id ? updatedUser : u));
      });
    }
  });
}
