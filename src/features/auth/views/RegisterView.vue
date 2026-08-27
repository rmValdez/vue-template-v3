<script setup lang="ts">
import { RouterLink } from 'vue-router';
import RegisterForm from '../components/RegisterForm.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, ThemeToggle } from '@/shared/ui';
import { Layers } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center p-4 bg-background relative overflow-hidden">
    <!-- Ambient glow background -->
    <div
      class="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
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
          Create Account
        </h1>
        <p class="text-xs text-muted-foreground">
          Get started with your enterprise workspace today
        </p>
      </div>

      <Card className="border-border/80 shadow-xl bg-card/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create a new workspace account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-4 text-xs text-muted-foreground">
          Already have an account?
          <RouterLink
            to="/login"
            class="ml-1.5 font-semibold text-primary hover:underline"
          >
            Sign in
          </RouterLink>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
