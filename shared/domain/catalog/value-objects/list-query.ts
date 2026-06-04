export type SortBy = 'price' | 'rating' | 'distance' | 'name'
export type SortOrder = 'asc' | 'desc'

export interface ListQuery {
  search?: string
  specialties?: string[]
  modalities?: string[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  city?: string
  maxDistanceKm?: number
  sortBy: SortBy
  sortOrder: SortOrder
  page: number
  pageSize: number
}

export const DEFAULT_LIST_QUERY: ListQuery = {
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  pageSize: 24,
}
