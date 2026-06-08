import type { ListQuery, SortBy, SortOrder } from '#shared/domain/catalog/value-objects/list-query'
import { DEFAULT_LIST_QUERY } from '#shared/domain/catalog/value-objects/list-query'
import { parseListQuery } from '#shared/domain/catalog/value-objects/parse-list-query'
import { findAllTrainers } from '../services/trainer-repository'

export default defineEventHandler((event) => {
  const queryParams = getQuery(event)
  const query: ListQuery = parseListQuery(queryParams as Record<string, string | string[] | undefined>)

  return findAllTrainers(query)
})
