# Beginner Guide to Vue 3 & FAOS Architecture

Welcome to the **Vue 3 Master Template**! This guide is designed for developers building production-grade Vue 3 applications using modern Composition API, Pinia, and TanStack Vue Query.

---

## 1. Vue 3 Composition API & `<script setup>`

Every component in this repository uses `<script setup lang="ts">`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/shared/ui';

const count = ref(0);
</script>

<template>
  <Button (click)="count++">Count: {{ count }}</Button>
</template>
```

---

## 2. Server State with `useSafeQuery`

Never store remote server data in raw component `ref()`s. Use `useSafeQuery`:

```ts
import { useSafeQuery } from '@/shared/query/useSafeQuery';
import { PostListSchema } from '../model/types';
import { postsApi } from '../api/postsApi';

export function usePosts() {
  return useSafeQuery({
    queryKey: ['posts', 'list'],
    queryFn: postsApi.getPosts,
    schema: PostListSchema,
    staleTime: 1000 * 60 * 5
  });
}
```

---

## 3. Client State with Pinia

Global UI state and authentication credentials belong in Pinia stores under `src/features/auth/model/authStore.ts`.
