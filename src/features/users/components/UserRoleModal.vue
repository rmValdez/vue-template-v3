<script setup lang="ts">
import { ref, watch } from 'vue';
import { Modal, Button } from '@/shared/ui';
import type { UserItem } from '../model/types';
import type { Role } from '@/shared/auth/permissions';
import { useUpdateUserRoleMutation } from '../api/usersApi';
import { toast } from 'vue-sonner';

const props = defineProps<{
  user: UserItem | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const selectedRole = ref<Role>('member');
const updateRoleMutation = useUpdateUserRoleMutation();

watch(
  () => props.user,
  newUser => {
    if (newUser) {
      selectedRole.value = newUser.role;
    }
  },
  { immediate: true }
);

async function handleSave() {
  if (!props.user) return;

  try {
    await updateRoleMutation.mutateAsync({
      userId: props.user.id,
      role: selectedRole.value
    });
    toast.success('Role Updated', {
      description: `${props.user.name}'s role was updated to ${selectedRole.value}.`
    });
    emit('close');
  } catch {
    // Errors automatically routed through error-router
  }
}
</script>

<template>
  <Modal
    :is-open="isOpen"
    title="Change User Role"
    :description="user ? `Modify access permissions for ${user.name}` : ''"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <div class="space-y-2">
        <label class="text-xs font-semibold text-foreground/80">Select Role</label>
        <select
          v-model="selectedRole"
          class="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="admin">Admin (Full Access &amp; System Configuration)</option>
          <option value="manager">Manager (User &amp; Content Management)</option>
          <option value="member">Member (Content Creation &amp; View)</option>
          <option value="guest">Guest (Read Only)</option>
        </select>
      </div>

      <div class="flex items-center justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" @click="emit('close')">Cancel</Button>
        <Button
          variant="primary"
          size="sm"
          :loading="updateRoleMutation.isPending.value"
          @click="handleSave"
        >
          Save Changes
        </Button>
      </div>
    </div>
  </Modal>
</template>
