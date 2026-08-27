<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

const props = defineProps<{ className?: string }>();
const classes = computed(() => cn('flex items-center p-6 pt-0', props.className));
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
