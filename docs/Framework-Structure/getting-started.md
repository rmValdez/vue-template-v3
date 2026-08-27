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

When running in Mock mode or connected to Nuxt 3 backend:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` | Full access (Users, Posts, Dashboard, Settings) |
| **Member** | `user@example.com` | `password123` | Content creation & dashboard view |

---

## 3. Switching between Mock API and Live Nuxt Backend

In `vue-template-v3/.env`:
- **Live Nuxt 3 Backend Mode**:
  ```env
  VITE_API_BASE_URL="http://localhost:3000/api"
  VITE_ENABLE_MOCK_API=false
  ```
- **Standalone Mock Mode (Zero backend dependency)**:
  ```env
  VITE_ENABLE_MOCK_API=true
  ```
