<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

const props = defineProps<{ className?: string }>();
const classes = computed(() =>
  cn('text-xl font-bold leading-none tracking-tight text-foreground', props.className)
);
</script>

<template>
  <h3 :class="classes">
    <slot />
  </h3>
</template>
