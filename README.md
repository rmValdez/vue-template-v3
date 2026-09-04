<div align="center">
  <img src="https://vuejs.org/images/logo.png" alt="Vue.js Logo" width="120" height="120" />
  <h1>Vue 3 Master Template</h1>
  <p>A highly-opinionated, production-ready enterprise template for building scalable Vue applications.</p>

  <div>
    <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat-square&logo=vue.js" alt="Vue 3" />
    <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Pinia-3.x-FFD859?style=flat-square&logo=vuedotjs" alt="Pinia" />
    <img src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=react-query" alt="TanStack Query" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vitest-tested-6E9F18?style=flat-square&logo=vitest" alt="Vitest" />
    <img src="https://img.shields.io/badge/Storybook-8.x-FF4785?style=flat-square&logo=storybook" alt="Storybook" />
    <img src="https://img.shields.io/badge/Playwright-E2E-2EAD33?style=flat-square&logo=playwright" alt="Playwright" />
    <img src="https://img.shields.io/badge/ESLint-9.x-4B32C3?style=flat-square&logo=eslint" alt="ESLint" />
  </div>
</div>

<hr />

## 🗺️ Architecture Overview (FAOS)

```mermaid
graph TD
    subgraph APP ["app/ & router/ — Dumb Composer & Navigation Layer"]
        A[App.vue / router.ts] --> F1
        A --> F2
        A --> F3
        A --> F4
    end

    subgraph FEATURES ["features/ — Business Domains (Isolated)"]
        F1[auth/]
        F2[users/]
        F3[posts/]
        F4[dashboard/]
    end

    subgraph SHARED ["shared/ — Pure Infrastructure (Agnostic Reusables)"]
        S1["query/\nuseSafeQuery\nuseSafeMutation"]
        S2["errors/\nApiError · errorRouter\nretryPolicy · telemetry"]
        S3["lib/api\nhttp.ts · env.ts · token.ts"]
        S4["auth/\nRBAC engine"]
        S5["flags/\nFeature flags"]
        S6["ui/\nDesign system components"]
    end

    F1 & F2 & F3 & F4 --> S1
    F1 & F2 & F3 & F4 --> S3
    F1 & F2 & F3 & F4 --> S6
    S1 --> S2
    S3 --> S2

    subgraph CI ["CI Pipeline (GitHub Actions)"]
        CI1[type-check] --> CI2[lint]
        CI2 --> CI3[validate FAOS]
        CI3 --> CI4[vitest]
        CI4 --> CI5[build]
    end
```

---

## ✨ Features & Capabilities

- **Framework**: [Vue 3.5](https://vuejs.org/) (Composition API, `<script setup>`, TypeScript 5)
- **Bundler**: [Vite 6](https://vitejs.dev/) with ultra-fast HMR and optimized production bundling
- **UI & Styling**: [Tailwind CSS v3.4](https://tailwindcss.com/), `clsx`, `tailwind-merge`, and instant Dark/Light mode switching
- **Server State**: [TanStack Vue Query v5](https://tanstack.com/query/latest) with typed `useSafeQuery` and `useSafeMutation`
- **Client State**: [Pinia v3](https://pinia.vuejs.org/) for auth session and client UI state
- **Runtime Validation**: [Zod](https://zod.dev/) parsing at every API boundary
- **Error Routing**: Typed `ApiError` pipeline with automatic notification toasts and session expiry handling
- **Security & RBAC**: Fine-grained role-based access control engine
- **Component Development**: [Storybook 8](https://storybook.js.org/) (`@storybook/vue3-vite`)
- **Unit & Component Testing**: [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/)
- **E2E Testing**: [Playwright](https://playwright.dev/)
- **Architecture Enforcement**: Static boundary scanner (`tools/validate-architecture.mjs`)
- **Git Hygiene**: Commitlint (Conventional Commits), lint-staged, and GitHub Actions CI

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Local Development Server

```bash
npm run dev
```

### 3. Run Automated Quality Checks

```bash
# Static architecture boundary check
npm run validate

# TypeScript type checking
npm run type-check

# ESLint check
npm run lint

# Unit & component test suite
npm run test

# Run Storybook component workbench
npm run storybook

# Production build
npm run build
```

---

## 🏛️ Project Structure

```
src/
├── app/                  # Application initialization, root provider, and CSS
├── features/             # Isolated business domain modules
│   ├── auth/             # Authentication, login/register, session store
│   ├── dashboard/        # Analytics, telemetry charts, activity feed
│   ├── users/            # User directory, table, role management
│   └── posts/            # Articles, markdown insights, optimistic CRUD
├── router/               # Typed routing, guards, and RBAC hooks
├── shared/               # Pure agnostic infrastructure & design system
│   ├── api/              # Http client, token storage, endpoint registry
│   ├── auth/             # RBAC engine and permissions
│   ├── config/           # Validated environment configuration
│   ├── errors/           # ApiError, telemetry, error router
│   ├── flags/            # Feature flag composable
│   ├── pagination/       # Pagination utilities
│   ├── query/            # useSafeQuery / useSafeMutation wrappers
│   ├── ui/               # Design system UI components
│   └── utils/            # Helper utilities (cn, etc.)
└── stories/              # Storybook UI documentation
```

---

## 📄 License

MIT © [rmValdez](https://github.com/rmValdez)
