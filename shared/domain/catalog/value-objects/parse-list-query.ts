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

function setStringField(
  result: Record<string, string | undefined>,
  key: string,
  value: string | undefined,
): void {
  if (value) {
    result[key] = value
  }
}

function setNumberField(
  result: Record<string, string | undefined>,
  key: string,
  value: number | undefined,
): void {
  if (value != null) {
    result[key] = String(value)
  }
}

function setFieldWhenDifferent<T extends string | number>(
  result: Record<string, string | undefined>,
  key: string,
  value: T | undefined,
  defaultValue: T,
): void {
  if (value != null && value !== defaultValue) {
    result[key] = String(value)
  }
}

export function serializeListQueryToRoute(query: Partial<ListQuery>): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {}

  setStringField(result, 'search', query.search)
  setStringField(result, 'city', query.city)

  if (query.specialties?.length) {
    result.specialties = query.specialties.join(',')
  }

  if (query.modalities?.length) {
    result.modalities = query.modalities.join(',')
  }

  setNumberField(result, 'minPrice', query.minPrice)
  setNumberField(result, 'maxPrice', query.maxPrice)
  setNumberField(result, 'minRating', query.minRating)
  setNumberField(result, 'maxDistanceKm', query.maxDistanceKm)

  if (query.onPromotion === true) {
    result.onPromotion = 'true'
  }

  setFieldWhenDifferent(result, 'priceView', query.priceView, DEFAULT_PRICE_VIEW)
  setFieldWhenDifferent(result, 'sortBy', query.sortBy, DEFAULT_LIST_QUERY.sortBy)
  setFieldWhenDifferent(result, 'sortOrder', query.sortOrder, DEFAULT_LIST_QUERY.sortOrder)
  setFieldWhenDifferent(result, 'page', query.page, DEFAULT_LIST_QUERY.page)
  setFieldWhenDifferent(result, 'pageSize', query.pageSize, DEFAULT_LIST_QUERY.pageSize)

  return result
}
