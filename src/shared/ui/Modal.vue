<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue';
import { X } from 'lucide-vue-next';

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const props = withDefaults(defineProps<ModalProps>(), {
  isOpen: false,
  title: '',
  description: '',
  maxWidth: 'md'
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl'
};

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close');
  }
}

watch(
  () => props.isOpen,
  open => {
    if (typeof document !== 'undefined') {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }
);

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div
          class="relative w-full overflow-hidden rounded-xl border border-border bg-card p-6 text-card-foreground shadow-2xl transition-all duration-200"
          :class="maxWidthClasses[maxWidth]"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 v-if="title" class="text-lg font-bold text-foreground">
                {{ title }}
              </h3>
              <p v-if="description" class="text-xs text-muted-foreground mt-1">
                {{ description }}
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              @click="emit('close')"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <!-- Body -->
          <div class="mt-2">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
