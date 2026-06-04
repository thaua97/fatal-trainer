import type { ListQuery } from '#shared/domain/catalog/value-objects/list-query'
import { DEFAULT_LIST_QUERY } from '#shared/domain/catalog/value-objects/list-query'

export function useTrainerFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<ListQuery>(() => ({
    search: typeof route.query.search === 'string' ? route.query.search : undefined,
    sortBy: (typeof route.query.sortBy === 'string' ? route.query.sortBy : DEFAULT_LIST_QUERY.sortBy) as ListQuery['sortBy'],
    sortOrder: route.query.sortOrder === 'desc' ? 'desc' : 'asc',
    page: Number(route.query.page) || DEFAULT_LIST_QUERY.page,
    pageSize: Number(route.query.pageSize) || DEFAULT_LIST_QUERY.pageSize,
  }))

  function updateFilters(partial: Partial<ListQuery>) {
    router.push({
      query: {
        ...route.query,
        ...partial,
        page: partial.page ?? 1,
      },
    })
  }

  return {
    filters,
    updateFilters,
  }
}
