# Development Guidelines & Coding Standards

## 1. Vue 3 Composition API & `<script setup>`
- Always use `<script setup lang="ts">`.
- Group logic by concern using composables (`use...`).
- Type all props and emits with TypeScript interface declarations.

```vue
<script setup lang="ts">
export interface ComponentProps {
  title: string;
  variant?: 'default' | 'outline';
}

const props = withDefaults(defineProps<ComponentProps>(), {
  variant: 'default'
});

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();
</script>
```

## 2. API Contracts & Runtime Validation
- Every API endpoint response MUST have a corresponding Zod schema.
- Validate data via `useSafeQuery` or `useSafeMutation`.
- Never trust external API payloads directly as raw `any`.

## 3. Styling & Token Consistency
- Use Tailwind utility classes with CSS variables (`text-foreground`, `bg-card`, `border-border`).
- Wrap conditionally applied classes with `cn(...)` (`clsx` + `tailwind-merge`).
