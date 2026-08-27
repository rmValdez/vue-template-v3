import { useQueryClient } from '@tanstack/vue-query';
import { http } from '@/shared/api/http';
import { ENDPOINTS } from '@/shared/api/endpoints';
import { useSafeQuery } from '@/shared/query/useSafeQuery';
import { useSafeMutation } from '@/shared/query/useSafeMutation';
import {
  PostListSchema,
  PostSchema,
  type PostList,
  type Post,
  type CreatePostInput
} from '../model/types';

export const postsApi = {
  getPosts: async (): Promise<PostList> => {
    const data = await http.get<PostList>(ENDPOINTS.posts.list);
    return PostListSchema.parse(data);
  },

  createPost: async (input: CreatePostInput, authorName: string = 'Admin'): Promise<Post> => {
    const tags = input.tags
      ? input.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      : ['general'];

    const payload = {
      title: input.title,
      content: input.content,
      author: authorName,
      tags
    };

    const data = await http.post<Post>(ENDPOINTS.posts.create, payload);
    return PostSchema.parse(data);
  },

  deletePost: async (id: string): Promise<void> => {
    await http.delete(ENDPOINTS.posts.delete(id));
  }
};

export function usePostsQuery() {
  return useSafeQuery({
    queryKey: ['posts', 'list'],
    queryFn: postsApi.getPosts,
    schema: PostListSchema
  });
}

export function useCreatePostMutation(authorName: string = 'Admin') {
  const queryClient = useQueryClient();

  return useSafeMutation({
    mutationFn: (input: CreatePostInput) => postsApi.createPost(input, authorName),
    schema: PostSchema,
    onSuccess: newPost => {
      queryClient.setQueryData<PostList>(['posts', 'list'], old => {
        if (!old) return [newPost];
        return [newPost, ...old];
      });
    }
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useSafeMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<PostList>(['posts', 'list'], old => {
        if (!old) return [];
        return old.filter(p => p.id !== deletedId);
      });
    }
  });
}
