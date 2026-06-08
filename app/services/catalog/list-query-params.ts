import type { ListQuery } from '#shared/domain/catalog/value-objects/list-query'
import { serializeListQueryToRoute } from '#shared/domain/catalog/value-objects/parse-list-query'

export function listQueryToParams(query: Partial<ListQuery>): Record<string, string | undefined> {
  return serializeListQueryToRoute(query)
}
