<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { Sun, Moon } from 'lucide-vue-next';

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: ''
});

const toggleDark = useToggle(isDark);
</script>

<template>
  <button
    type="button"
    aria-label="Toggle Theme"
    class="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-accent text-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    @click="toggleDark()"
  >
    <Sun
      class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500"
    />
    <Moon
      class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400"
    />
  </button>
</template>
