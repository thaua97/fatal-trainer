import { DEFAULT_LIST_QUERY } from '#shared/domain/catalog/value-objects/list-query'

export function useFTTrainerList() {
  const { filters, updateFilters } = useTrainerFilters()
  const {
    trainers,
    total,
    pending,
    status,
    data,
    query,
    hasMore,
    isLoadingMore,
    loadMore,
  } = usePersonalTrainers()

  watch(filters, (value) => {
    Object.assign(query.value, value)
  }, { deep: true, immediate: true })

  const isLoading = computed(() => {
    if (trainers.value.length > 0) {
      return false
    }

    return pending.value || status.value === 'pending' || data.value == null
  })

  const isEmpty = computed(() => !isLoading.value && trainers.value.length === 0)

  function clearFilters() {
    updateFilters({
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
    trainers,
    total,
    pending,
    isLoading,
    isLoadingMore,
    isEmpty,
    hasMore,
    loadMore,
    clearFilters,
  }
}
