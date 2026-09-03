import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { type Ref, unref } from 'vue';
import { http } from '@/shared/api/http';
import { ENDPOINTS } from '@/shared/api/endpoints';
import {
  VUE_100_QUIZ_BANK,
  type VueQuizQuestion
} from '../data/vue-quiz-questions.data';

export interface QuizApiResponse {
  status: string;
  message: string;
  data: {
    items: VueQuizQuestion[];
    total: number;
  };
}

export interface QuizProgressResponse {
  status: string;
  message: string;
  data: {
    id?: string;
    sessionId: string;
    answers: Record<number, number>;
    score: number;
    answeredCount: number;
  };
}

export function useVueQuizQuestions(
  categoryRef?: Ref<string>,
  difficultyRef?: Ref<string>,
  searchRef?: Ref<string>
) {
  return useQuery({
    queryKey: ['vue-quiz-questions', categoryRef, difficultyRef, searchRef],
    queryFn: async () => {
      const category = categoryRef ? unref(categoryRef) : 'ALL';
      const difficulty = difficultyRef ? unref(difficultyRef) : 'ALL';
      const search = searchRef ? unref(searchRef) : '';

      const params: Record<string, string> = {};
      if (category && category !== 'ALL') params.category = category;
      if (difficulty && difficulty !== 'ALL') params.difficulty = difficulty;
      if (search) params.search = search;

      try {
        const res = await http.get<QuizApiResponse>(ENDPOINTS.quiz.list, {
          params,
          requiresAuth: false
        });
        return res.data;
      } catch (error) {
        console.warn('Fallback to local Vue quiz dataset:', error);
        return {
          items: VUE_100_QUIZ_BANK,
          total: VUE_100_QUIZ_BANK.length
        };
      }
    },
    staleTime: 1000 * 60 * 5
  });
}

export function useVueQuizProgress() {
  return useQuery({
    queryKey: ['vue-quiz-progress'],
    queryFn: async () => {
      try {
        const res = await http.get<QuizProgressResponse>(
          ENDPOINTS.quiz.progress,
          { requiresAuth: false }
        );
        return res.data;
      } catch (error) {
        console.warn('Could not fetch quiz progress from PostgreSQL:', error);
        return {
          sessionId: 'default-session',
          answers: {},
          score: 0,
          answeredCount: 0
        };
      }
    },
    staleTime: 1000 * 60 * 2
  });
}

export function useSaveVueQuizProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      answers: Record<number, number>;
      score: number;
      answeredCount: number;
    }) => {
      return http.post<QuizProgressResponse>(ENDPOINTS.quiz.progress, payload, {
        requiresAuth: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vue-quiz-progress'] });
    }
  });
}

export function useResetVueQuizProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return http.post<QuizProgressResponse>(
        ENDPOINTS.quiz.reset,
        {},
        { requiresAuth: false }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vue-quiz-progress'] });
    }
  });
}
