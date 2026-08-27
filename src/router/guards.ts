import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/features/auth';
import type { Role } from '@/shared/auth/permissions';

export async function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  // Initialize auth session on first route transition
  if (!authStore.isInitialized) {
    await authStore.initAuth();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);
  const requiredRoles = to.meta.roles as Role[] | undefined;

  // Guest-only routes (e.g. /login, /register)
  if (guestOnly && authStore.isAuthenticated) {
    return next({ path: '/dashboard' });
  }

  // Protected routes
  if (requiresAuth && !authStore.isAuthenticated) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }

  // Role-based Access Control Guard
  if (requiresAuth && requiredRoles && requiredRoles.length > 0) {
    const hasAccess = authStore.canAccessRoute(requiredRoles);
    if (!hasAccess) {
      return next({ path: '/dashboard' });
    }
  }

  return next();
}
