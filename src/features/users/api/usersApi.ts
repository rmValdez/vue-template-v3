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

export const usersApi = {
  getUsers: async (): Promise<UserList> => {
    const data = await http.get<UserList>(ENDPOINTS.users.list);
    return UserListSchema.parse(data);
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
