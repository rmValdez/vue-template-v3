<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { Toaster } from 'vue-sonner';
import { AppLayout } from '@/shared/ui';
import { useAuthStore } from '@/features/auth';

const route = useRoute();
const authStore = useAuthStore();

const isAuthRoute = computed(() => {
  return route.name === 'login' || route.name === 'register';
});

onMounted(async () => {
  await authStore.initAuth();
});

function handleLogout() {
  authStore.logout();
}
</script>

<template>
  <div>
    <!-- Global Notifications Toaster -->
    <Toaster
      position="top-right"
      :toast-options="{
        classNames: {
          toast:
            'bg-card text-card-foreground border-border shadow-xl rounded-xl',
          description: 'text-muted-foreground text-xs',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground'
        }
      }"
    />

    <!-- Auth View (Login / Register without AppLayout Shell) -->
    <div v-if="isAuthRoute">
      <RouterView />
    </div>

    <!-- Protected Application Views with AppLayout Shell -->
    <AppLayout v-else :user="authStore.user" @logout="handleLogout">
      <RouterView />
    </AppLayout>
  </div>
</template>
