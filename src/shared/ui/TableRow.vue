<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

const props = defineProps<{ className?: string }>();
const classes = computed(() =>
  cn(
    'border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
    props.className
  )
);
</script>

<template>
  <tr :class="classes">
    <slot />
  </tr>
</template>
