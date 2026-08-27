export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    refresh: '/auth/refresh',
    logout: '/auth/logout'
  },
  users: {
    list: '/users',
    detail: (id: string | number) => `/users/${id}`,
    updateRole: (id: string | number) => `/users/${id}/role`
  },
  posts: {
    list: '/posts',
    detail: (id: string | number) => `/posts/${id}`,
    create: '/posts',
    update: (id: string | number) => `/posts/${id}`,
    delete: (id: string | number) => `/posts/${id}`
  },
  dashboard: {
    stats: '/dashboard/stats',
    activity: '/dashboard/activity',
    analytics: '/dashboard/analytics'
  }
} as const;
