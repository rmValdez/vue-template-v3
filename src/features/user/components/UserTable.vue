<script setup lang="ts">
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button
} from '@/shared/ui';
import type { UserItem, UserList } from '../model/types';
import { Shield, UserCheck } from 'lucide-vue-next';

defineProps<{
  users: UserList;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'edit-role', user: UserItem): void;
}>();

const roleBadgeVariants = {
  admin: 'destructive' as const,
  manager: 'warning' as const,
  member: 'default' as const,
  guest: 'outline' as const
};

const statusBadgeVariants = {
  active: 'success' as const,
  inactive: 'secondary' as const,
  pending: 'warning' as const
};
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>User</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Joined</TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="u in users" :key="u.id">
        <TableCell>
          <div class="flex items-center gap-3">
            <img
              v-if="u.avatar"
              :src="u.avatar"
              :alt="u.name"
              class="h-9 w-9 rounded-full object-cover border border-border shrink-0"
            />
            <div
              v-else
              class="h-9 w-9 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0"
            >
              {{ u.name.charAt(0) }}
            </div>
            <div>
              <p class="font-semibold text-foreground">{{ u.name }}</p>
              <p class="text-xs text-muted-foreground">{{ u.email }}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge :variant="roleBadgeVariants[u.role]">
            <Shield v-if="u.role === 'admin'" class="h-3 w-3 mr-1" />
            <UserCheck v-else class="h-3 w-3 mr-1" />
            {{ u.role }}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge :variant="statusBadgeVariants[u.status]">
            {{ u.status }}
          </Badge>
        </TableCell>
        <TableCell class="text-xs text-muted-foreground font-mono">
          {{ new Date(u.createdAt).toLocaleDateString() }}
        </TableCell>
        <TableCell class="text-right">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            @click="emit('edit-role', u)"
          >
            Change Role
          </Button>
        </TableCell>
      </TableRow>

      <TableRow v-if="users.length === 0">
        <TableCell
          colspan="5"
          class="text-center py-8 text-muted-foreground text-xs"
        >
          No users matching criteria.
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
