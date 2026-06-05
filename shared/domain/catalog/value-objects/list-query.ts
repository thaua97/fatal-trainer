export type SortBy = 'price' | 'rating' | 'distance' | 'name' | 'reviewCount' | 'experienceYears' | 'discount'
export type SortOrder = 'asc' | 'desc'
export type PriceView = 'session' | 'monthly'

export interface ListQuery {
  search?: string
  specialties?: string[]
  modalities?: string[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  city?: string
  maxDistanceKm?: number
  onPromotion?: boolean
  priceView?: PriceView
  sortBy: SortBy
  sortOrder: SortOrder
  page: number
  pageSize: number
}

export const DEFAULT_PRICE_VIEW: PriceView = 'session'

export const DEFAULT_LIST_QUERY: ListQuery = {
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  pageSize: 24,
  priceView: DEFAULT_PRICE_VIEW,
}
