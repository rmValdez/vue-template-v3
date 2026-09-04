# Getting Started with Vue 3 Master Template

## Prerequisites

- Node.js 18+ or 20+
- pnpm 9.x (`npm install -g pnpm@9`)

---

## 1. Quick Start

```bash
# Navigate and install dependencies
cd vue-template-v3
pnpm install

# Start Vite dev server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 2. Default Seed Accounts

When connected to PostgreSQL backend (`http://localhost:3002/api/v1`):

| Role       | Email               | Password       | Permissions                                     |
| :--------- | :------------------ | :------------- | :---------------------------------------------- |
| **Admin**  | `admin@example.com` | `Password123!` | Full access (Users, Posts, Dashboard, Settings) |
| **Dev**    | `dev@example.com`   | `Password123!` | Developer access & API diagnostics              |
| **Member** | `user@example.com`  | `Password123!` | Content creation & dashboard view               |

---

## 3. Backend Integration

In `vue-template-v3/.env`:

```env
VITE_API_BASE_URL="http://localhost:3002/api/v1"
VITE_APP_ENV="development"
```

All API calls (`/auth`, `/users`, `/dashboard`, `/quiz`) communicate directly with the live PostgreSQL backend with tenant isolation (`x-tenant-id: vue-v3`).
