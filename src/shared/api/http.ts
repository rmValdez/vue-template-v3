import { env } from '../config/env';
import { tokenStorage } from './token';
import { ApiError } from '../errors/api-error';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  requiresAuth?: boolean;
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

  post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const http = new HttpClient();
