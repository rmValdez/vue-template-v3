<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Button } from '@/shared/ui';
import type { Post } from '../model/types';
import { Calendar, User, Trash2 } from 'lucide-vue-next';

defineProps<{
  post: Post;
  canDelete?: boolean;
}>();

const emit = defineEmits<{
  (e: 'delete', id: string): void;
}>();
</script>

<template>
  <Card className="flex flex-col justify-between hover:border-primary/40 transition-all duration-200">
    <CardHeader>
      <div class="flex items-start justify-between gap-2">
        <CardTitle className="text-lg leading-snug">
          {{ post.title }}
        </CardTitle>
        <button
          v-if="canDelete"
          type="button"
          title="Delete article"
          class="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors"
          @click="emit('delete', post.id)"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </div>
      <div class="flex items-center gap-3 text-xs text-muted-foreground mt-2">
        <span class="flex items-center gap-1">
          <User class="h-3 w-3" />
          {{ post.author }}
        </span>
        <span class="flex items-center gap-1">
          <Calendar class="h-3 w-3" />
          {{ new Date(post.createdAt).toLocaleDateString() }}
        </span>
      </div>
    </CardHeader>

    <CardContent>
      <p class="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
        {{ post.content }}
      </p>
    </CardContent>

    <CardFooter className="flex items-center justify-between border-t border-border/40 pt-3">
      <div class="flex flex-wrap gap-1.5">
        <Badge
          v-for="tag in post.tags"
          :key="tag"
          variant="secondary"
          className="text-[10px] lowercase"
        >
          #{{ tag }}
        </Badge>
      </div>
      <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary">
        Read Article →
      </Button>
    </CardFooter>
  </Card>
</template>
