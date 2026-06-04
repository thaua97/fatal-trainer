import type { ListQuery, SortBy, SortOrder } from '#shared/domain/catalog/value-objects/list-query'
import { DEFAULT_LIST_QUERY } from '#shared/domain/catalog/value-objects/list-query'
import { findAllTrainers } from '../services/trainer-repository'

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseSortBy(value: string | undefined): SortBy {
  const allowed: SortBy[] = ['price', 'rating', 'distance', 'name']
  return allowed.includes(value as SortBy) ? (value as SortBy) : DEFAULT_LIST_QUERY.sortBy
}

function parseSortOrder(value: string | undefined): SortOrder {
  return value === 'desc' ? 'desc' : 'asc'
}

export default defineEventHandler((event) => {
  const queryParams = getQuery(event)

  const query: ListQuery = {
    search: typeof queryParams.search === 'string' ? queryParams.search : undefined,
    sortBy: parseSortBy(typeof queryParams.sortBy === 'string' ? queryParams.sortBy : undefined),
    sortOrder: parseSortOrder(typeof queryParams.sortOrder === 'string' ? queryParams.sortOrder : undefined),
    page: parseNumber(typeof queryParams.page === 'string' ? queryParams.page : undefined, DEFAULT_LIST_QUERY.page),
    pageSize: parseNumber(
      typeof queryParams.pageSize === 'string' ? queryParams.pageSize : undefined,
      DEFAULT_LIST_QUERY.pageSize,
    ),
  }

  return findAllTrainers(query)
})
