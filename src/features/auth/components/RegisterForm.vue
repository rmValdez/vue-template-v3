<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { Button, Input } from '@/shared/ui';
import { useAuthStore } from '../model/authStore';
import { RegisterCredentialsSchema } from '../model/types';
import { UserPlus } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const isSubmitting = ref(false);

async function handleSubmit() {
  errors.name = '';
  errors.email = '';
  errors.password = '';
  errors.confirmPassword = '';

  const validation = RegisterCredentialsSchema.safeParse(form);
  if (!validation.success) {
    validation.error.issues.forEach(issue => {
      const field = issue.path[0] as keyof typeof errors;
      if (field && field in errors) {
        errors[field] = issue.message;
      }
    });
    return;
  }

  isSubmitting.value = true;
  try {
    await authStore.register(validation.data);
    toast.success('Account created successfully!', {
      description: `Welcome, ${form.name}`
    });
    router.push('/dashboard');
  } catch (error: unknown) {
    const err = error as { message?: string };
    toast.error('Registration Failed', {
      description: err.message || 'Could not complete registration.'
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <Input
      v-model="form.name"
      label="Full Name"
      type="text"
      placeholder="Jane Doe"
      :error="errors.name"
      :disabled="isSubmitting"
      required
    />

    <Input
      v-model="form.email"
      label="Email Address"
      type="email"
      placeholder="jane@example.com"
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

    <Input
      v-model="form.confirmPassword"
      label="Confirm Password"
      type="password"
      placeholder="••••••••"
      :error="errors.confirmPassword"
      :disabled="isSubmitting"
      required
    />

    <Button
      type="submit"
      variant="primary"
      size="lg"
      className="w-full mt-2 font-semibold shadow-lg shadow-primary/20"
      :loading="isSubmitting"
    >
      <UserPlus class="h-4 w-4 mr-2" />
      Create Account
    </Button>
  </form>
</template>
