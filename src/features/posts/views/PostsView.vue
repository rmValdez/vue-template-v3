<script setup lang="ts">
import { ref } from 'vue';
import { usePostsQuery, useDeletePostMutation } from '../api/postsApi';
import PostCard from '../components/PostCard.vue';
import PostFormModal from '../components/PostFormModal.vue';
import { Button } from '@/shared/ui';
import { PlusCircle } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const { data: posts, isLoading } = usePostsQuery();
const deletePostMutation = useDeletePostMutation();

const isCreateModalOpen = ref(false);

async function handleDeletePost(id: string) {
  try {
    await deletePostMutation.mutateAsync(id);
    toast.success('Post Deleted', {
      description: 'The post was successfully removed.'
    });
  } catch {
    // Handled via error router
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black tracking-tight text-foreground">
          Articles &amp; Architecture Insights
        </h2>
        <p class="text-xs text-muted-foreground mt-0.5">
          Knowledge base, system documentation, and engineering blogs
        </p>
      </div>

      <Button
        variant="primary"
        size="md"
        @click="isCreateModalOpen = true"
      >
        <PlusCircle class="h-4 w-4 mr-2" />
        New Article
      </Button>
    </div>

    <!-- Posts Grid -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-64 rounded-xl bg-muted/40 animate-pulse"></div>
    </div>

    <div v-else-if="posts && posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :can-delete="true"
        @delete="handleDeletePost"
      />
    </div>

    <div v-else class="text-center py-16 border border-dashed border-border rounded-xl">
      <p class="text-sm font-semibold text-foreground">No articles published yet</p>
      <p class="text-xs text-muted-foreground mt-1">Get started by creating your first post.</p>
      <Button
        variant="primary"
        size="sm"
        className="mt-4"
        @click="isCreateModalOpen = true"
      >
        Create Post
      </Button>
    </div>

    <!-- Create Post Modal -->
    <PostFormModal
      :is-open="isCreateModalOpen"
      @close="isCreateModalOpen = false"
    />
  </div>
</template>
