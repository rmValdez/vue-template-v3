import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { authGuard } from './guards';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/views/LoginView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/features/auth/views/RegisterView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/features/dashboard/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/features/user/views/UsersView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager'] }
  },
  {
    path: '/user',
    redirect: '/users'
  },
  {
    path: '/sandbox',
    name: 'sandbox',
    component: () => import('@/features/sandbox/views/SandboxView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

router.beforeEach(authGuard);

export default router;
