import { env } from '../config/env';
import { tokenStorage } from './token';
import { ApiError } from '../errors/api-error';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  requiresAuth?: boolean;
}

// In-memory mock store for rich local development / testing
const mockPosts = [
  {
    id: 'post-1',
    title: 'Architecting Scalable Frontends with Vue 3 and Vite',
    content:
      'Feature-Architecture Oriented Structure (FAOS) isolates business domains, preventing monolithic spaghetti and enabling seamless team scaling.',
    author: 'Dev Lead',
    tags: ['vue3', 'architecture', 'typescript'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'post-2',
    title: 'Resilient Server State with TanStack Query v5',
    content:
      'TanStack Vue Query provides automatic caching, background deduplication, optimistic mutations, and zero boilerplate polling.',
    author: 'Frontend Architect',
    tags: ['vue-query', 'state-management', 'performance'],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'post-3',
    title: 'Fine-Grained RBAC in Modern SPAs',
    content:
      'Enforcing strict permission checking at route guards, UI components, and API boundaries ensures airtight enterprise security.',
    author: 'Security Specialist',
    tags: ['security', 'rbac', 'vue-router'],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

const mockUsers = [
  {
    id: 'user-1',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    createdAt: '2026-01-15T08:30:00Z'
  },
  {
    id: 'user-2',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: '2026-02-10T11:20:00Z'
  },
  {
    id: 'user-3',
    name: 'Morgan Chen',
    email: 'morgan@example.com',
    role: 'member',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: '2026-03-01T14:45:00Z'
  }
];

async function handleMockRequest<T>(
  endpoint: string,
  method: string,
  body?: unknown
): Promise<T> {
  await new Promise(resolve => setTimeout(resolve, 250)); // Simulating network latency

  // Auth mock
  if (endpoint.includes('/auth/login')) {
    const b = body as { email?: string };
    const email = b?.email || 'admin@example.com';
    const role = email.includes('user') ? 'member' : 'admin';
    return {
      user: {
        id: 'usr_mock_123',
        name: email.split('@')[0],
        email,
        role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      },
      accessToken: 'mock_jwt_access_token_vue_template',
      refreshToken: 'mock_jwt_refresh_token_vue_template'
    } as T;
  }

  if (endpoint.includes('/auth/me')) {
    return {
      id: 'usr_mock_123',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    } as T;
  }

  // Users mock
  if (endpoint.startsWith('/users')) {
    if (method === 'GET') {
      return [...mockUsers] as T;
    }
    if (method === 'PATCH' || method === 'PUT') {
      const parts = endpoint.split('/');
      const userId = parts[2];
      const user = mockUsers.find(u => u.id === userId);
      if (user && body && typeof body === 'object') {
        Object.assign(user, body);
        return { ...user } as T;
      }
    }
  }

  // Posts mock
  if (endpoint.startsWith('/posts')) {
    if (method === 'GET') {
      return [...mockPosts] as T;
    }
    if (method === 'POST') {
      const newPost = {
        id: `post-${Date.now()}`,
        ...(body as object),
        createdAt: new Date().toISOString()
      };
      mockPosts.unshift(newPost as (typeof mockPosts)[0]);
      return newPost as T;
    }
    if (method === 'DELETE') {
      const parts = endpoint.split('/');
      const postId = parts[2];
      const index = mockPosts.findIndex(p => p.id === postId);
      if (index !== -1) {
        mockPosts.splice(index, 1);
      }
      return { success: true } as T;
    }
  }

  // Dashboard mock
  if (endpoint.includes('/dashboard/stats')) {
    return {
      totalUsers: 14280,
      usersGrowth: 12.5,
      activeSessions: 3840,
      sessionsGrowth: 8.2,
      totalRevenue: 89450,
      revenueGrowth: 23.1,
      apiHealth: 99.98
    } as T;
  }

  if (endpoint.includes('/dashboard/activity')) {
    return [
      {
        id: 'act-1',
        title: 'New Enterprise Tenant Provisioned',
        description: 'Organization "Acme Corp" completed onboarding.',
        timestamp: '10 minutes ago',
        type: 'success'
      },
      {
        id: 'act-2',
        title: 'Role Permissions Modified',
        description: 'User "Morgan Chen" updated from Member to Manager.',
        timestamp: '45 minutes ago',
        type: 'info'
      },
      {
        id: 'act-3',
        title: 'Automated Security Scan Passed',
        description: 'Zero critical vulnerabilities reported across all features.',
        timestamp: '2 hours ago',
        type: 'warning'
      }
    ] as T;
  }

  return {} as T;
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = env.VITE_API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          url.searchParams.append(key, String(val));
        }
      });
    }

    return url.toString();
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      params,
      body,
      requiresAuth = true,
      headers: customHeaders,
      ...customOptions
    } = options;

    if (env.VITE_ENABLE_MOCK_API) {
      return handleMockRequest<T>(
        endpoint,
        options.method || 'GET',
        body
      );
    }

    const url = this.buildUrl(endpoint, params);
    const headers = new Headers(customHeaders);

    if (body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (!headers.has('x-tenant-id')) {
      headers.set('x-tenant-id', 'vue-v3');
    }

    // Handle Refresh Token Endpoint vs standard Bearer Access Token
    if (endpoint.includes('/auth/refresh')) {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${refreshToken}`);
      }
    } else if (requiresAuth) {
      const token = tokenStorage.getAccessToken();
      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    try {
      const response = await fetch(url, {
        ...customOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        const message =
          (typeof errorData === 'object' &&
            errorData !== null &&
            'message' in errorData &&
            typeof errorData.message === 'string' &&
            errorData.message) ||
          `Request failed with status ${response.status}`;

        throw new ApiError({
          message,
          status: response.status,
          details: errorData
        });
      }

      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;

      throw new ApiError({
        message:
          error instanceof Error
            ? error.message
            : 'A network connectivity error occurred.',
        isNetworkError: true
      });
    }
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const http = new HttpClient();
