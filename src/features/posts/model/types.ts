import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  author: z.string(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string()
});

export type Post = z.infer<typeof PostSchema>;

export const PostListSchema = z.array(PostSchema);
export type PostList = z.infer<typeof PostListSchema>;

export const CreatePostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  tags: z.string().optional()
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
