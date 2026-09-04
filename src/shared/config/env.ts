import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_TITLE: z.string().default('Vue 3 Master Template'),
  // node-postg-backend-template on port 3002
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3002/api/v1'),
  VITE_APP_ENV: z
    .enum(['development', 'staging', 'production', 'test'])
    .default('development')
});

export const env = envSchema.parse({
  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE
});

export type Env = z.infer<typeof envSchema>;
