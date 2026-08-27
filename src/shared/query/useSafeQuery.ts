import { useQuery, type UseQueryOptions, type QueryKey } from '@tanstack/vue-query';
import { z } from 'zod';
import { routeError, type ErrorAction } from '../errors/error-router';
import { ApiError } from '../errors/api-error';

export interface SafeQueryOptions<TData, TSchema extends z.ZodTypeAny>
  extends Omit<UseQueryOptions<TData, ApiError, z.infer<TSchema>, QueryKey>, 'queryKey' | 'queryFn'> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  schema: TSchema;
  errorAction?: ErrorAction;
}

export function useSafeQuery<TData, TSchema extends z.ZodTypeAny>(
  options: SafeQueryOptions<TData, TSchema>
) {
  const { queryKey, queryFn, schema, errorAction = 'toast', ...queryOptions } = options;

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const rawData = await queryFn();
        const parsed = schema.safeParse(rawData);
        if (!parsed.success) {
          console.error('[Zod Schema Validation Failure]', parsed.error.format());
          throw new ApiError({
            message: 'API response failed runtime schema validation.',
            code: 'SCHEMA_VALIDATION_ERROR',
            details: parsed.error.issues
          });
        }
        return parsed.data;
      } catch (error) {
        routeError(error, { action: errorAction });
        throw ApiError.fromUnknown(error);
      }
    },
    ...queryOptions
  });
}
