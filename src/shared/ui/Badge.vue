<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

export interface BadgeProps {
  variant?:
    'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
  className?: string;
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
  className: ''
});

const variantClasses = {
  default: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border-transparent',
  outline: 'text-foreground border-border',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  success:
    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  warning:
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
};

const classes = computed(() =>
  cn(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
    variantClasses[props.variant],
    props.className
  )
);
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
