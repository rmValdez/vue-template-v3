<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

const props = defineProps<{ className?: string }>();
const classes = computed(() =>
  cn(
    'h-11 px-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider [&:has([role=checkbox])]:pr-0',
    props.className
  )
);
</script>

<template>
  <th :class="classes">
    <slot />
  </th>
</template>
