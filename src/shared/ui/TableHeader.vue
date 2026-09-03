<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

const props = defineProps<{ className?: string }>();
const classes = computed(() =>
  cn('[&_tr]:border-b bg-muted/40', props.className)
);
</script>

<template>
  <thead :class="classes">
    <slot />
  </thead>
</template>
