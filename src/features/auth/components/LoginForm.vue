<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { Button, Input } from '@/shared/ui';
import { useAuthStore } from '../model/authStore';
import { LoginCredentialsSchema } from '../model/types';
import { LogIn } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: ''
});

const errors = reactive({
  email: '',
  password: ''
});

const isSubmitting = ref(false);

function fillCredentials(email: string, pass: string) {
  form.email = email;
  form.password = pass;
  errors.email = '';
  errors.password = '';
}

async function handleSubmit() {
  errors.email = '';
  errors.password = '';

  const validation = LoginCredentialsSchema.safeParse(form);
  if (!validation.success) {
    validation.error.issues.forEach(issue => {
      if (issue.path[0] === 'email') errors.email = issue.message;
      if (issue.path[0] === 'password') errors.password = issue.message;
    });
    return;
  }

  isSubmitting.value = true;
  try {
    await authStore.login(validation.data);
    toast.success('Welcome back!', {
      description: `Signed in as ${authStore.user?.name || form.email}`
    });
    router.push('/dashboard');
  } catch (error: unknown) {
    const err = error as { message?: string };
    toast.error('Authentication Failed', {
      description: err.message || 'Invalid credentials. Please try again.'
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <Input
      v-model="form.email"
      label="Email Address"
      type="email"
      placeholder="admin@example.com"
      :error="errors.email"
      :disabled="isSubmitting"
      required
    />

    <Input
      v-model="form.password"
      label="Password"
      type="password"
      placeholder="••••••••"
      :error="errors.password"
      :disabled="isSubmitting"
      required
    />

    <div class="flex items-center gap-2 pt-1">
      <button
        type="button"
        class="flex-1 text-[11px] font-medium py-1.5 px-2.5 rounded-lg border border-border/80 bg-accent/30 hover:bg-accent hover:text-foreground text-muted-foreground transition-colors"
        @click="fillCredentials('admin@example.com', 'password123')"
      >
        Fill Admin Demo
      </button>
      <button
        type="button"
        class="flex-1 text-[11px] font-medium py-1.5 px-2.5 rounded-lg border border-border/80 bg-accent/30 hover:bg-accent hover:text-foreground text-muted-foreground transition-colors"
        @click="fillCredentials('user@example.com', 'password123')"
      >
        Fill Member Demo
      </button>
    </div>

    <Button
      type="submit"
      variant="primary"
      size="lg"
      className="w-full mt-2 font-semibold shadow-lg shadow-primary/20"
      :loading="isSubmitting"
    >
      <LogIn class="h-4 w-4 mr-2" />
      Sign In
    </Button>
  </form>
</template>
