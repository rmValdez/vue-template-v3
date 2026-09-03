<script setup lang="ts">
import { RouterLink } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  ThemeToggle
} from '@/shared/ui';
import { Layers } from 'lucide-vue-next';
</script>

<template>
  <div
    class="min-h-screen flex flex-col justify-center items-center p-4 bg-background relative overflow-hidden"
  >
    <!-- Ambient glow background -->
    <div
      class="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
    ></div>

    <div class="absolute top-6 right-6">
      <ThemeToggle />
    </div>

    <div class="w-full max-w-md space-y-6 z-10">
      <!-- Logo Header -->
      <div class="text-center space-y-2">
        <div
          class="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 items-center justify-center text-primary-foreground shadow-lg shadow-primary/25 mb-2"
        >
          <Layers class="h-6 w-6" />
        </div>
        <h1 class="text-2xl font-black tracking-tight text-foreground">
          Vue Master Template
        </h1>
        <p class="text-xs text-muted-foreground">
          Enterprise Vue 3 + TypeScript Starter
        </p>
      </div>

      <Card className="border-border/80 shadow-xl bg-card/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter
          className="flex justify-center border-t border-border/50 pt-4 text-xs text-muted-foreground"
        >
          Don't have an account?
          <RouterLink
            to="/register"
            class="ml-1.5 font-semibold text-primary hover:underline"
          >
            Create account
          </RouterLink>
        </CardFooter>
      </Card>

      <div class="text-center text-[11px] text-muted-foreground/80 space-y-1">
        <p>
          Demo accounts:
          <span class="font-mono font-bold text-foreground"
            >admin@example.com</span
          >
          (Admin) or
          <span class="font-mono font-bold text-foreground"
            >user@example.com</span
          >
          (Member)
        </p>
        <p>
          Password: <span class="font-mono">any password &gt; 6 chars</span>
        </p>
      </div>
    </div>
  </div>
</template>
