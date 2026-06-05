import { computed } from 'vue'
import type { ListQuery } from '../../shared/domain/catalog/value-objects/list-query'
import { DEFAULT_LIST_QUERY } from '../../shared/domain/catalog/value-objects/list-query'
import { storyFiltersComputed, storyUpdateFilters } from './catalog-filter-state'

export function useFTFilterPanel() {
  const search = computed({
    get: () => storyFiltersComputed.value.search ?? '',
    set: (value: string) => storyUpdateFilters({ search: value || undefined, page: 1 }),
  })

  function clearFilters() {
    storyUpdateFilters({
      search: undefined,
      specialties: undefined,
      modalities: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      city: undefined,
      maxDistanceKm: undefined,
      onPromotion: undefined,
      priceView: undefined,
      sortBy: DEFAULT_LIST_QUERY.sortBy,
      sortOrder: DEFAULT_LIST_QUERY.sortOrder,
      page: 1,
    })
  }

  return {
    filters: storyFiltersComputed,
    updateFilters: storyUpdateFilters,
    clearFilters,
    search,
  }
}
