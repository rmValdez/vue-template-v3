<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

const props = defineProps<{ className?: string }>();
const classes = computed(() => cn('[&_tr:last-child]:border-0', props.className));
</script>

<template>
  <tbody :class="classes">
    <slot />
  </tbody>
</template>
