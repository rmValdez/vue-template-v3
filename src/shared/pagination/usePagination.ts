import { ref, computed } from 'vue';

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const page = ref(options.initialPage ?? 1);
  const pageSize = ref(options.initialPageSize ?? 10);
  const total = ref(options.totalItems ?? 0);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / pageSize.value))
  );

  const hasNextPage = computed(() => page.value < totalPages.value);
  const hasPrevPage = computed(() => page.value > 1);

  const nextPage = () => {
    if (hasNextPage.value) {
      page.value++;
    }
  };

  const prevPage = () => {
    if (hasPrevPage.value) {
      page.value--;
    }
  };

  const setPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      page.value = newPage;
    }
  };

  const setPageSize = (newPageSize: number) => {
    pageSize.value = newPageSize;
    page.value = 1;
  };

  const setTotal = (newTotal: number) => {
    total.value = newTotal;
  };

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    setPage,
    setPageSize,
    setTotal
  };
}
