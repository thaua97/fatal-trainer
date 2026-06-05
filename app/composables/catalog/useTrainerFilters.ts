import type { ListQuery } from '#shared/domain/catalog/value-objects/list-query'
import { DEFAULT_LIST_QUERY } from '#shared/domain/catalog/value-objects/list-query'
import { parseListQuery, serializeListQueryToRoute } from '#shared/domain/catalog/value-objects/parse-list-query'

export function useTrainerFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<ListQuery>(() =>
    parseListQuery(route.query as Record<string, string | string[] | undefined>),
  )

  function updateFilters(partial: Partial<ListQuery>) {
    const next: Partial<ListQuery> = {
      ...filters.value,
      ...partial,
      page: partial.page ?? 1,
    }

    const serialized = serializeListQueryToRoute(next)

    router.push({ query: serialized })
  }

  return {
    filters,
    updateFilters,
    defaultQuery: DEFAULT_LIST_QUERY,
  }
}
