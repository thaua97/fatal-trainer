import { DEFAULT_LIST_QUERY } from '#shared/domain/catalog/value-objects/list-query'

export function useFTActiveFilterCount() {
  const { filters } = useTrainerFilters()

  const count = computed(() => {
    const f = filters.value
    let total = 0

    if (f.search) total += 1
    if (f.specialties?.length) total += f.specialties.length
    if (f.modalities?.length) total += f.modalities.length
    if (f.minPrice != null || f.maxPrice != null) total += 1
    if (f.minRating != null) total += 1
    if (f.city) total += 1
    if (f.maxDistanceKm != null) total += 1
    if (f.onPromotion === true) total += 1

    return total
  })

  const hasActiveFilters = computed(() => count.value > 0)

  const hasNonDefaultSort = computed(() =>
    filters.value.sortBy !== DEFAULT_LIST_QUERY.sortBy
    || filters.value.sortOrder !== DEFAULT_LIST_QUERY.sortOrder,
  )

  return {
    count,
    hasActiveFilters,
    hasNonDefaultSort,
  }
}
