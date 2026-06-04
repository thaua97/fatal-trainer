import type { FeaturedTrainersResponse } from '#shared/types/api'

export function useFeaturedTrainers() {
  const { data, pending, status, error, refresh } = useFetch<FeaturedTrainersResponse>(
    '/api/personal-trainers/featured',
  )

  const trainers = computed(() => data.value?.items ?? [])

  return {
    data,
    trainers,
    pending,
    status,
    error,
    refresh,
  }
}
