<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

const props = defineProps<{ className?: string }>();
const classes = computed(() =>
  cn('text-sm text-muted-foreground leading-relaxed', props.className)
);
</script>

<template>
  <p :class="classes">
    <slot />
  </p>
</template>
