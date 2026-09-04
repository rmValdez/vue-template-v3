<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';
import { Loader2 } from 'lucide-vue-next';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
  className: ''
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const variantClasses = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm focus-visible:ring-primary',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary',
  outline:
    'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
  ghost: 'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm focus-visible:ring-destructive'
};

const sizeClasses = {
  sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
  md: 'h-10 px-4 text-sm rounded-lg gap-2',
  lg: 'h-12 px-6 text-base rounded-lg gap-2.5',
  icon: 'h-10 w-10 p-0 rounded-lg justify-center'
};

const classes = computed(() =>
  cn(
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.className
  )
);
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
  >
    <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
    <slot />
  </button>
</template>
