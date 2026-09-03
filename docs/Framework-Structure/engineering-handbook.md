# Vue 3 Engineering Handbook & Architectural Standard

This handbook serves as the definitive source of truth for architectural boundaries, design patterns, and philosophies of the **Vue 3 Master Template (`vue-template-v3`)**.

---

## 1. Architectural Philosophy

This project is a high-performance **Feature-Architecture Oriented (FAOS)** Single Page Application built on Vue 3 and Vite.

- **Predictability over abstraction**: Explicit TypeScript contracts validated by Zod at every API boundary.
- **Composition API with `<script setup>`**: Modern composable hooks for clean logic reuse and zero boilerplate.
- **Strict Layer Isolation**: Strict 3-tier boundary between `app/` (composition), `features/` (business domains), and `shared/` (infrastructure).
- **Dual State Segregation**: Server State is managed with `@tanstack/vue-query`, while Client UI & Session state is encapsulated in `pinia`.

---

## 2. The 3-Tier Layered Architecture

```mermaid
graph TD
    App["src/app/ & src/router/\n(Composition & Routing)"]
    Features["src/features/*\n(Isolated Business Domains)"]
    Shared["src/shared/*\n(Pure Infrastructure & Design System)"]

    App --> Features
    App --> Shared
    Features --> Shared
```

### `src/app/` & `src/router/` (The Composition Layer)

- Maps URLs to feature views and establishes global providers (QueryClient, Pinia, Toaster).
- **Rule**: Never implements business logic directly. Composes views from `src/features/`.

### `src/features/` (The Business Domains)

- Self-contained domain modules (`auth/`, `dashboard/`, `users/`, `posts/`).
- **Rule**: **Strict Feature Isolation**. `features/A` must NEVER import from `features/B`. Communication happens via `app/` composition or `shared/` contracts. Enforced by `tools/validate-architecture.mjs`.

### `src/shared/` (The Global Infrastructure)

- Generic UI design system components (`Button`, `Card`, `Input`, `Badge`, `Modal`, `Table`).
- Networking client (`http.ts`), error classification (`ApiError`), retry policies, token storage, and RBAC evaluator.
- **Rule**: Must have zero knowledge of specific business domains.

---

## 3. Data Flow & State Architecture Standards

```text
┌──────────────────────────────────────────────┐
│                  Vue 3                       │
├──────────────────────────────────────────────┤
│ Component state                              │
│   → ref() / reactive()                       │
│                                              │
│ Server/API state                             │
│   → TanStack Vue Query                       │
│                                              │
│ Global application state                     │
│   → Pinia                                    │
│                                              │
│ Reactive utilities                           │
│   → VueUse                                   │
│                                              │
│ API validation                               │
│   → Zod                                      │
│                                              │
│ HTTP                                         │
│   → fetch / dedicated HttpClient (http.ts)   │
└──────────────────────────────────────────────┘
```

### 📌 Rule of Thumb:

| Responsibility              | Technology                 | Usage Example                                                       |
| :-------------------------- | :------------------------- | :------------------------------------------------------------------ |
| **API Data & Server State** | **TanStack Vue Query**     | `useSafeQuery`, `useSafeMutation`, query cache & invalidation       |
| **User & Session State**    | **Pinia**                  | `useAuthStore` (user identity, RBAC roles, `sessionStorage` tokens) |
| **Component UI State**      | **`ref()` / `reactive()`** | Active tabs, modal open/close, accordion toggles, local inputs      |
| **Browser & DOM Utilities** | **VueUse**                 | `useLocalStorage`, `useWindowSize`, `useIntersectionObserver`       |
| **Contract Validation**     | **Zod**                    | `UserSchema.safeParse()`, form validation DTOs                      |
| **HTTP Transport**          | **`HttpClient` (`fetch`)** | Multi-tenant header (`x-tenant-id`), JWT Bearer injection           |

> [!NOTE]
> **Strict Architectural Rule**: No Vuex, no RxJS, and no second state-management/query library. Keep dependencies lean, fast, and maintainable.
