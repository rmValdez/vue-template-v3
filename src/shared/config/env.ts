import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_TITLE: z.string().default('Vue 3 Master Template'),
  // nuxt-template-v2, the shared local auth backend for this template and
  // angular-template-v4.
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000/api'),
  VITE_ENABLE_MOCK_API: z
    .string()
    .default('false')
    .transform(val => val === 'true'),
  VITE_APP_ENV: z
    .enum(['development', 'staging', 'production', 'test'])
    .default('development')
});

export const env = envSchema.parse({
  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE
});

export type Env = z.infer<typeof envSchema>;
