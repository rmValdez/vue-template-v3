<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

const props = defineProps<{ className?: string }>();
const classes = computed(() => cn('w-full caption-bottom text-sm', props.className));
</script>

<template>
  <div class="relative w-full overflow-auto rounded-lg border border-border">
    <table :class="classes">
      <slot />
    </table>
  </div>
</template>
