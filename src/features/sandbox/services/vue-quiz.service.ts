import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { type Ref, unref } from 'vue';
import { VUE_100_QUIZ_BANK, type VueQuizQuestion } from '../data/vue-quiz-questions.data';

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

const API_BASE_URL = 'http://localhost:3002/api/v1/quiz';
const TENANT_ID = 'vue-v3';

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

      const params = new URLSearchParams();
      if (category && category !== 'ALL') params.append('category', category);
      if (difficulty && difficulty !== 'ALL') params.append('difficulty', difficulty);
      if (search) params.append('search', search);

      try {
        const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
          headers: {
            'x-tenant-id': TENANT_ID,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: QuizApiResponse = await response.json();
        return data.data;
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
        const response = await fetch(`${API_BASE_URL}/progress`, {
          headers: {
            'x-tenant-id': TENANT_ID,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: QuizProgressResponse = await response.json();
        return data.data;
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
      const response = await fetch(`${API_BASE_URL}/progress`, {
        method: 'POST',
        headers: {
          'x-tenant-id': TENANT_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to save progress: ${response.statusText}`);
      }

      return response.json();
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
      const response = await fetch(`${API_BASE_URL}/progress/reset`, {
        method: 'POST',
        headers: {
          'x-tenant-id': TENANT_ID,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to reset progress: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vue-quiz-progress'] });
    }
  });
}
