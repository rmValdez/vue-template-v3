import { useMutation, type UseMutationOptions } from '@tanstack/vue-query';
import { z } from 'zod';
import { routeError, type ErrorAction } from '../errors/error-router';
import { ApiError } from '../errors/api-error';

export interface SafeMutationOptions<TData, TVariables, TSchema extends z.ZodTypeAny | undefined = undefined>
  extends Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  schema?: TSchema;
  errorAction?: ErrorAction;
}

export function useSafeMutation<
  TData,
  TVariables,
  TSchema extends z.ZodTypeAny | undefined = undefined
>(options: SafeMutationOptions<TData, TVariables, TSchema>) {
  const { mutationFn, schema, errorAction = 'toast', ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      try {
        const rawData = await mutationFn(variables);
        if (schema) {
          const parsed = schema.safeParse(rawData);
          if (!parsed.success) {
            console.error('[Zod Mutation Schema Validation Failure]', parsed.error.format());
            throw new ApiError({
              message: 'Mutation response failed runtime schema validation.',
              code: 'SCHEMA_VALIDATION_ERROR',
              details: parsed.error.issues
            });
          }
          return parsed.data;
        }
        return rawData;
      } catch (error) {
        routeError(error, { action: errorAction });
        throw ApiError.fromUnknown(error);
      }
    },
    ...mutationOptions
  });
}
