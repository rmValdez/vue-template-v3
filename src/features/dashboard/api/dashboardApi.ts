import { http } from '@/shared/api/http';
import { ENDPOINTS } from '@/shared/api/endpoints';
import { useSafeQuery } from '@/shared/query/useSafeQuery';
import {
  DashboardStatsSchema,
  ActivityListSchema,
  type DashboardStats,
  type ActivityList
} from '../model/types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const data = await http.get<DashboardStats>(ENDPOINTS.dashboard.stats);
    return DashboardStatsSchema.parse(data);
  },

  getActivity: async (): Promise<ActivityList> => {
    const data = await http.get<ActivityList>(ENDPOINTS.dashboard.activity);
    return ActivityListSchema.parse(data);
  }
};

export function useDashboardStats() {
  return useSafeQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
    schema: DashboardStatsSchema,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}

export function useDashboardActivity() {
  return useSafeQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: dashboardApi.getActivity,
    schema: ActivityListSchema,
    staleTime: 1000 * 60 * 2 // 2 minutes
  });
}
