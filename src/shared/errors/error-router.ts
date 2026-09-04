import { toast } from 'vue-sonner';
import { ApiError } from './api-error';
import { telemetry } from './telemetry';
import { tokenStorage } from '../api/token';

export type ErrorAction = 'toast' | 'silent' | 'redirect';

export interface RouteErrorOptions {
  action?: ErrorAction;
  customMessage?: string;
  fallbackMessage?: string;
}

export function routeError(
  error: unknown,
  options: RouteErrorOptions = {}
): void {
  const apiError = ApiError.fromUnknown(error);
  const action = options.action ?? 'toast';

  telemetry.logError(apiError, {
    status: apiError.status,
    code: apiError.code
  });

  // Handle Unauthenticated (401)
  if (apiError.status === 401) {
    tokenStorage.clearTokens();
    if (action !== 'silent') {
      toast.error('Session Expired', {
        description: 'Your session has expired. Please sign in again.'
      });
    }
    if (
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/login')
    ) {
      window.location.href = '/login';
    }
    return;
  }

  // Handle Forbidden (403)
  if (apiError.status === 403) {
    if (action !== 'silent') {
      toast.error('Access Denied', {
        description:
          apiError.message ||
          'You do not have permission to perform this action.'
      });
    }
    return;
  }

  // Handle Validation Error (422)
  if (apiError.status === 422) {
    if (action !== 'silent') {
      toast.error('Validation Error', {
        description:
          apiError.message || 'Please check your inputs and try again.'
      });
    }
    return;
  }

  // Handle Server Errors (500+)
  if (apiError.status >= 500) {
    if (action !== 'silent') {
      toast.error('Server Error', {
        description:
          options.fallbackMessage ||
          'A server error occurred. Please try again later.'
      });
    }
    return;
  }

  // General Toast for other errors
  if (action === 'toast') {
    toast.error('Error', {
      description:
        options.customMessage || apiError.message || 'An error occurred.'
    });
  }
}
