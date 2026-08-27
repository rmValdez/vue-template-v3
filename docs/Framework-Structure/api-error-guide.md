# API Error Handling Guide — Vue 3

This document explains the deterministic error handling pipeline in `vue-template-v3`.

---

## 1. Error Pipeline Architecture

```
http.ts → ApiError (normalized + status code)
        → error-router (toast | redirect | session expiry)
        → useSafeQuery / useSafeMutation (Zod schema validation)
        → UI component (form errors, feedback)
```

---

## 2. Error Categorization & Behavior

| Status | Category | System Behavior |
| :--- | :--- | :--- |
| **401** | Unauthenticated | Clears token storage, displays session expiration toast, redirects to `/login`. |
| **403** | Forbidden | Displays "Access Denied" toast. Navigation unchanged. |
| **422** | Validation | Displays validation issue description. |
| **500+** | Server Error | Displays graceful fallback error toast and logs report to telemetry. |

---

## 3. Schema Failure Protection

If an API backend changes a response format unexpectedly, `useSafeQuery` catches the discrepancy via `Zod.safeParse()`, prevents frontend UI crashes, and logs the issue with full issue diagnostics.
