import type { PaginatedTrainersResponse } from '#shared/types/api'

const PREVIEW_SORT = {
  sortBy: 'rating' as const,
  sortOrder: 'desc' as const,
}

export function useFTTrainerListPreview(limit = 6) {
  const { data, pending, status } = useFetch<PaginatedTrainersResponse>(
    '/api/personal-trainers',
    {
      query: {
        page: 1,
        pageSize: limit,
        ...PREVIEW_SORT,
      },
    },
  )

  const trainers = computed(() => data.value?.items ?? [])

  const isLoading = computed(
    () => pending.value || status.value === 'pending' || data.value == null,
  )

  const isEmpty = computed(() => !isLoading.value && trainers.value.length === 0)

  return {
    trainers,
    isLoading,
    isEmpty,
  }
}
