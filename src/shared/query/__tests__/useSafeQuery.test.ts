import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { ApiError } from '@/shared/errors/api-error';

describe('Zod Schema Integration & Safe Verification', () => {
  const UserResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email()
  });

  it('validates compliant payloads correctly', () => {
    const validData = {
      id: 'usr-1',
      name: 'Alice',
      email: 'alice@example.com'
    };

    const parsed = UserResponseSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it('catches non-compliant payloads with validation errors', () => {
    const invalidData = {
      id: 'usr-1',
      name: 'Alice',
      email: 'not-an-email'
    };

    const parsed = UserResponseSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it('correctly converts unknown errors into ApiError instances', () => {
    const err = new Error('Database connection failed');
    const apiErr = ApiError.fromUnknown(err);

    expect(apiErr).toBeInstanceOf(ApiError);
    expect(apiErr.message).toBe('Database connection failed');
  });
});
