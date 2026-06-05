import type { ListQuery, SortBy, SortOrder, PriceView } from '#shared/domain/catalog/value-objects/list-query'
import { DEFAULT_LIST_QUERY, DEFAULT_PRICE_VIEW } from '#shared/domain/catalog/value-objects/list-query'
import { parseQueryArray, parseQueryBoolean } from '#shared/utils/parse-query-params'

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (value == null) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseSortBy(value: string | undefined): SortBy {
  const allowed: SortBy[] = [
    'price',
    'rating',
    'distance',
    'name',
    'reviewCount',
    'experienceYears',
    'discount',
  ]
  return allowed.includes(value as SortBy) ? (value as SortBy) : DEFAULT_LIST_QUERY.sortBy
}

function parseSortOrder(value: string | undefined): SortOrder {
  return value === 'desc' ? 'desc' : 'asc'
}

function parsePriceView(value: string | undefined): PriceView {
  return value === 'monthly' ? 'monthly' : DEFAULT_PRICE_VIEW
}

export function parseListQuery(queryParams: Record<string, string | string[] | undefined>): ListQuery {
  const search = typeof queryParams.search === 'string' ? queryParams.search : undefined

  return {
    search,
    specialties: parseQueryArray(queryParams.specialties),
    modalities: parseQueryArray(queryParams.modalities),
    minPrice: parseOptionalNumber(typeof queryParams.minPrice === 'string' ? queryParams.minPrice : undefined),
    maxPrice: parseOptionalNumber(typeof queryParams.maxPrice === 'string' ? queryParams.maxPrice : undefined),
    minRating: parseOptionalNumber(typeof queryParams.minRating === 'string' ? queryParams.minRating : undefined),
    city: typeof queryParams.city === 'string' ? queryParams.city : undefined,
    maxDistanceKm: parseOptionalNumber(typeof queryParams.maxDistanceKm === 'string' ? queryParams.maxDistanceKm : undefined),
    onPromotion: parseQueryBoolean(typeof queryParams.onPromotion === 'string' ? queryParams.onPromotion : undefined),
    priceView: parsePriceView(typeof queryParams.priceView === 'string' ? queryParams.priceView : undefined),
    sortBy: parseSortBy(typeof queryParams.sortBy === 'string' ? queryParams.sortBy : undefined),
    sortOrder: parseSortOrder(typeof queryParams.sortOrder === 'string' ? queryParams.sortOrder : undefined),
    page: parseNumber(typeof queryParams.page === 'string' ? queryParams.page : undefined, DEFAULT_LIST_QUERY.page),
    pageSize: parseNumber(
      typeof queryParams.pageSize === 'string' ? queryParams.pageSize : undefined,
      DEFAULT_LIST_QUERY.pageSize,
    ),
  }
}

export function serializeListQueryToRoute(query: Partial<ListQuery>): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {}

  if (query.search) result.search = query.search
  if (query.specialties?.length) result.specialties = query.specialties.join(',')
  if (query.modalities?.length) result.modalities = query.modalities.join(',')
  if (query.minPrice != null) result.minPrice = String(query.minPrice)
  if (query.maxPrice != null) result.maxPrice = String(query.maxPrice)
  if (query.minRating != null) result.minRating = String(query.minRating)
  if (query.city) result.city = query.city
  if (query.maxDistanceKm != null) result.maxDistanceKm = String(query.maxDistanceKm)
  if (query.onPromotion === true) result.onPromotion = 'true'
  if (query.priceView && query.priceView !== DEFAULT_PRICE_VIEW) result.priceView = query.priceView
  if (query.sortBy && query.sortBy !== DEFAULT_LIST_QUERY.sortBy) result.sortBy = query.sortBy
  if (query.sortOrder && query.sortOrder !== DEFAULT_LIST_QUERY.sortOrder) result.sortOrder = query.sortOrder
  if (query.page && query.page !== DEFAULT_LIST_QUERY.page) result.page = String(query.page)
  if (query.pageSize && query.pageSize !== DEFAULT_LIST_QUERY.pageSize) result.pageSize = String(query.pageSize)

  return result
}
