import type { ListQuery } from '#shared/domain/catalog/value-objects/list-query'
import { parseListQuery } from '#shared/domain/catalog/value-objects/parse-list-query'
import { findAllTrainers } from '../services/trainer-repository'

export default defineEventHandler((event) => {
  const queryParams = getQuery(event)
  const query: ListQuery = parseListQuery(queryParams as Record<string, string | string[] | undefined>)

  return findAllTrainers(query)
})
