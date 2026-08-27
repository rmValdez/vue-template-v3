# State Management Guide

This project maintains a clean separation between **Server State** and **Client/UI State**.

---

## 🌐 Server State: `@tanstack/vue-query`

All asynchronous data fetched from remote APIs or backend services belongs to TanStack Query.

- Automatic caching & stale-time invalidation.
- Deduping identical requests across multiple active components.
- Background polling & optimistic mutation rollbacks.

### Query Pattern:
```ts
export function usePostsQuery() {
  return useSafeQuery({
    queryKey: ['posts', 'list'],
    queryFn: postsApi.getPosts,
    schema: PostListSchema,
    staleTime: 1000 * 60 * 5
  });
}
```

---

## 💻 Client & UI State: Pinia

Pinia is reserved exclusively for global client-side state:

- Authenticated session & user token credentials (`useAuthStore`).
- Theme selection (dark vs light).
- Global UI drawers, modal visibility, or application preferences.
