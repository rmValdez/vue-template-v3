<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

const props = defineProps<{ className?: string }>();
const classes = computed(() =>
  cn(
    'p-4 align-middle [&:has([role=checkbox])]:pr-0 text-sm text-foreground',
    props.className
  )
);
</script>

<template>
  <td :class="classes">
    <slot />
  </td>
</template>
