<script setup lang="ts">
import { ref } from 'vue';
import { z } from 'zod';
import Card from '@/shared/ui/Card.vue';
import Badge from '@/shared/ui/Badge.vue';
import Button from '@/shared/ui/Button.vue';

// Zod Schema with cross-field password matching
const FormSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address format'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

const form = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
});

const touched = ref<Record<string, boolean>>({});
const errors = ref<Record<string, string[]>>({});
const isSuccess = ref(false);

function validateField(fieldName: string) {
  touched.value[fieldName] = true;
  const result = FormSchema.safeParse(form.value);
  if (!result.success) {
    errors.value = result.error.flatten().fieldErrors;
  } else {
    errors.value = {};
  }
}

function handleSubmit() {
  touched.value = {
    email: true,
    username: true,
    password: true,
    confirmPassword: true
  };

  const result = FormSchema.safeParse(form.value);
  if (!result.success) {
    errors.value = result.error.flatten().fieldErrors;
    isSuccess.value = false;
  } else {
    errors.value = {};
    isSuccess.value = true;
    setTimeout(() => {
      isSuccess.value = false;
    }, 4000);
  }
}
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto w-full">
    <!-- Header -->
    <Card
      class="p-6 md:p-8 space-y-4 bg-gradient-to-br from-amber-500/10 via-primary/5 to-background border-amber-500/30"
    >
      <div class="flex items-center gap-2">
        <Badge
          variant="outline"
          class="bg-amber-500/10 text-amber-500 border-amber-500/30 font-bold"
        >
          📝 Reactive Forms & Zod Schema Validation
        </Badge>
        <span class="text-xs font-mono text-muted-foreground"
          >Type-Safe Schema Validation</span
        >
      </div>
      <h2 class="text-2xl md:text-3xl font-black text-foreground">
        Form Handling & Zod Validation Lab
      </h2>
      <p class="text-sm text-muted-foreground leading-relaxed">
        Test reactive two-way binding (<code
          class="text-primary font-mono font-bold"
          >v-model.trim</code
        >), Zod schema parsing, touched/dirty field state tracking, and
        cross-field password matching.
      </p>
    </Card>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Interactive Form -->
      <Card class="p-5 md:p-6 space-y-4">
        <h3 class="text-base font-bold text-foreground">
          Enterprise Registration Form
        </h3>

        <form class="space-y-3.5" @submit.prevent="handleSubmit">
          <!-- Email Input -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-foreground"
              >Email Address</label
            >
            <input
              v-model.trim="form.email"
              type="email"
              placeholder="developer@example.com"
              class="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              @blur="validateField('email')"
            />
            <p
              v-if="touched.email && errors.email"
              class="text-[11px] text-rose-500 font-bold"
            >
              {{ errors.email[0] }}
            </p>
          </div>

          <!-- Username Input -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-foreground">Username</label>
            <input
              v-model.trim="form.username"
              type="text"
              placeholder="alex_dev"
              class="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              @blur="validateField('username')"
            />
            <p
              v-if="touched.username && errors.username"
              class="text-[11px] text-rose-500 font-bold"
            >
              {{ errors.username[0] }}
            </p>
          </div>

          <!-- Password Input -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-foreground"
              >Password (min 8 chars)</label
            >
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              @blur="validateField('password')"
            />
            <p
              v-if="touched.password && errors.password"
              class="text-[11px] text-rose-500 font-bold"
            >
              {{ errors.password[0] }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-foreground"
              >Confirm Password</label
            >
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              @blur="validateField('confirmPassword')"
            />
            <p
              v-if="touched.confirmPassword && errors.confirmPassword"
              class="text-[11px] text-rose-500 font-bold"
            >
              {{ errors.confirmPassword[0] }}
            </p>
          </div>

          <Button type="submit" class="w-full mt-2"
            >Submit & Validate with Zod</Button
          >

          <div
            v-if="isSuccess"
            class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold text-center"
          >
            ✅ Form Successfully Validated with Zod!
          </div>
        </form>
      </Card>

      <!-- Live JSON Schema Inspector -->
      <Card class="p-5 md:p-6 space-y-3">
        <h3 class="text-base font-bold text-foreground">
          Live Form State & Zod Error Tree
        </h3>
        <p class="text-xs text-muted-foreground">
          Inspect reactive form values and parsed error nodes.
        </p>

        <div
          class="p-4 bg-zinc-950 dark:bg-black/90 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400 max-h-72 overflow-y-auto"
        >
          <pre>{{
            JSON.stringify(
              { values: form, errors: errors, touched: touched },
              null,
              2
            )
          }}</pre>
        </div>
      </Card>
    </div>
  </div>
</template>
