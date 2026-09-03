<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUsersQuery } from '../api/usersApi';
import UserTable from '../components/UserTable.vue';
import UserRoleModal from '../components/UserRoleModal.vue';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Button
} from '@/shared/ui';
import type { UserItem } from '../model/types';
import { Search, UserPlus } from 'lucide-vue-next';

const { data: users, isLoading } = useUsersQuery();

const searchQuery = ref('');
const selectedUserForRole = ref<UserItem | null>(null);
const isRoleModalOpen = ref(false);

const filteredUsers = computed(() => {
  if (!users.value) return [];
  if (!searchQuery.value.trim()) return users.value;
  const q = searchQuery.value.toLowerCase();
  return users.value.filter(
    u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.includes(q)
  );
});

function handleEditRole(user: UserItem) {
  selectedUserForRole.value = user;
  isRoleModalOpen.value = true;
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h2 class="text-2xl font-black tracking-tight text-foreground">
          User Management
        </h2>
        <p class="text-xs text-muted-foreground mt-0.5">
          Directory of registered workspace accounts, RBAC memberships, and
          status
        </p>
      </div>

      <Button variant="primary" size="md">
        <UserPlus class="h-4 w-4 mr-2" />
        Invite Member
      </Button>
    </div>

    <!-- Table Card -->
    <Card>
      <CardHeader>
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <CardTitle>All Accounts</CardTitle>
            <CardDescription>
              Showing {{ filteredUsers.length }} active accounts in tenant
            </CardDescription>
          </div>

          <div class="w-full sm:w-64 relative">
            <Search
              class="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search by name, email..."
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div v-if="isLoading" class="space-y-3 py-6">
          <div
            v-for="i in 3"
            :key="i"
            class="h-12 rounded-lg bg-muted/40 animate-pulse"
          ></div>
        </div>
        <UserTable v-else :users="filteredUsers" @edit-role="handleEditRole" />
      </CardContent>
    </Card>

    <!-- Role Modal -->
    <UserRoleModal
      :user="selectedUserForRole"
      :is-open="isRoleModalOpen"
      @close="isRoleModalOpen = false"
    />
  </div>
</template>
