<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

const props = defineProps<{
  className?: string;
}>();

const classes = computed(() =>
  cn(
    'rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:border-border',
    props.className
  )
);
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
