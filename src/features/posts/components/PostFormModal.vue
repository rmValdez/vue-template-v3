<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Modal, Button, Input } from '@/shared/ui';
import { CreatePostSchema, type CreatePostInput } from '../model/types';
import { useCreatePostMutation } from '../api/postsApi';
import { toast } from 'vue-sonner';

const props = defineProps<{
  isOpen: boolean;
  authorName?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const form = reactive<CreatePostInput>({
  title: '',
  content: '',
  tags: 'vue3, architecture'
});

const errors = reactive({
  title: '',
  content: '',
  tags: ''
});

const isSubmitting = ref(false);
const createPostMutation = useCreatePostMutation(props.authorName || 'Admin');

async function handleCreate() {
  errors.title = '';
  errors.content = '';
  errors.tags = '';

  const validation = CreatePostSchema.safeParse(form);
  if (!validation.success) {
    validation.error.issues.forEach(issue => {
      const field = issue.path[0] as keyof typeof errors;
      if (field && field in errors) {
        errors[field] = issue.message;
      }
    });
    return;
  }

  isSubmitting.value = true;
  try {
    await createPostMutation.mutateAsync(validation.data);
    toast.success('Post Published', {
      description: `"${form.title}" has been published successfully.`
    });
    form.title = '';
    form.content = '';
    form.tags = '';
    emit('close');
  } catch {
    // Errors handled via error router
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <Modal
    :is-open="isOpen"
    title="Create New Post"
    description="Publish technical announcements, architecture docs, or articles"
    max-width="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleCreate">
      <Input
        v-model="form.title"
        label="Post Title"
        placeholder="e.g. Scaling Pinia Stores Across Micro-frontends"
        :error="errors.title"
        :disabled="isSubmitting"
        required
      />

      <div class="space-y-1.5">
        <label class="text-xs font-semibold text-foreground/80 tracking-wide select-none">
          Content
        </label>
        <textarea
          v-model="form.content"
          rows="5"
          placeholder="Write comprehensive article content..."
          class="flex w-full rounded-lg border border-input bg-background/50 px-3.5 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150"
          :class="[errors.content && 'border-destructive focus-visible:ring-destructive']"
          :disabled="isSubmitting"
          required
        ></textarea>
        <p v-if="errors.content" class="text-xs font-medium text-destructive mt-0.5">
          {{ errors.content }}
        </p>
      </div>

      <Input
        v-model="form.tags"
        label="Tags (comma-separated)"
        placeholder="vue3, typescript, state-management"
        :error="errors.tags"
        :disabled="isSubmitting"
      />

      <div class="flex items-center justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" type="button" @click="emit('close')">
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          type="submit"
          :loading="isSubmitting"
        >
          Publish Article
        </Button>
      </div>
    </form>
  </Modal>
</template>
