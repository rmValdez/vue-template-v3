<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../utils/cn';

export interface InputProps {
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  id?: string;
  className?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  error: '',
  label: '',
  id: '',
  className: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
}>();

const inputId = computed(
  () => props.id || (props.label ? `input-${props.label.toLowerCase().replace(/\s+/g, '-')}` : undefined)
);

const inputClasses = computed(() =>
  cn(
    'flex h-10 w-full rounded-lg border border-input bg-background/50 px-3.5 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150',
    props.error && 'border-destructive focus-visible:ring-destructive',
    props.className
  )
);

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="w-full flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="text-xs font-semibold text-foreground/80 tracking-wide select-none"
    >
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        @input="handleInput"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />
    </div>
    <p v-if="error" class="text-xs font-medium text-destructive mt-0.5">
      {{ error }}
    </p>
  </div>
</template>
