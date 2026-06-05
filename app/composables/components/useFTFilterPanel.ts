import type { ListQuery } from '#shared/domain/catalog/value-objects/list-query'
import { DEFAULT_LIST_QUERY } from '#shared/domain/catalog/value-objects/list-query'

export function useFTFilterPanel() {
  const { t } = useI18n()
  const { filters, updateFilters } = useTrainerFilters()

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

  const search = computed({
    get: () => filters.value.search ?? '',
    set: (value: string) => updateFilters({ search: value || undefined, page: 1 }),
  })

  const sortBy = computed({
    get: () => filters.value.sortBy,
    set: (value: ListQuery['sortBy']) => updateFilters({ sortBy: value, page: 1 }),
  })

  const sortOptions = computed(() => [
    { label: t('sort.relevance'), value: 'name' },
    { label: t('sort.priceAsc'), value: 'price' },
    { label: t('sort.priceDesc'), value: 'price' },
    { label: t('sort.rating'), value: 'rating' },
    { label: t('sort.distance'), value: 'distance' },
    { label: t('sort.nameAsc'), value: 'name' },
  ])

  return {
    filters,
    updateFilters,
    clearFilters,
    search,
    sortBy,
    sortOptions,
  }
}
