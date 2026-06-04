import type { PaginatedTrainersResponse } from '#shared/types/api'
import type { ListQuery } from '#shared/domain/catalog/value-objects/list-query'
import { DEFAULT_LIST_QUERY } from '#shared/domain/catalog/value-objects/list-query'

export function usePersonalTrainers(initialQuery: Partial<ListQuery> = {}) {
  const query = useState<ListQuery>('personal-trainers-query', () => ({
    ...DEFAULT_LIST_QUERY,
    ...initialQuery,
  }))

  const { data, pending, status, error, refresh } = useFetch<PaginatedTrainersResponse>(
    '/api/personal-trainers',
    {
      query,
      watch: [query],
    },
  )

  const trainers = computed(() => data.value?.items ?? [])
  const total = computed(() => data.value?.total ?? 0)

  function loadMore() {
    query.value.page += 1
  }

  return {
    query,
    data,
    trainers,
    total,
    pending,
    status,
    error,
    refresh,
    loadMore,
  }
}
