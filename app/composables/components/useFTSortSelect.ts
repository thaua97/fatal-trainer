import type { ListQuery } from '#shared/domain/catalog/value-objects/list-query'

export function useFTSortSelect() {
  const { t } = useI18n()
  const { filters, updateFilters } = useTrainerFilters()

  const sortOptions = computed(() => [
    { label: t('sort.relevance'), value: 'name' as ListQuery['sortBy'], order: 'asc' as ListQuery['sortOrder'] },
    { label: t('sort.priceAsc'), value: 'price' as ListQuery['sortBy'], order: 'asc' as ListQuery['sortOrder'] },
    { label: t('sort.priceDesc'), value: 'price' as ListQuery['sortBy'], order: 'desc' as ListQuery['sortOrder'] },
    { label: t('sort.rating'), value: 'rating' as ListQuery['sortBy'], order: 'desc' as ListQuery['sortOrder'] },
    { label: t('sort.reviewCount'), value: 'reviewCount' as ListQuery['sortBy'], order: 'desc' as ListQuery['sortOrder'] },
    { label: t('sort.distance'), value: 'distance' as ListQuery['sortBy'], order: 'asc' as ListQuery['sortOrder'] },
    { label: t('sort.nameAsc'), value: 'name' as ListQuery['sortBy'], order: 'asc' as ListQuery['sortOrder'] },
    { label: t('sort.nameDesc'), value: 'name' as ListQuery['sortBy'], order: 'desc' as ListQuery['sortOrder'] },
    { label: t('sort.discount'), value: 'discount' as ListQuery['sortBy'], order: 'desc' as ListQuery['sortOrder'] },
    { label: t('sort.experience'), value: 'experienceYears' as ListQuery['sortBy'], order: 'desc' as ListQuery['sortOrder'] },
  ])

  const sortKey = computed({
    get: () => `${filters.value.sortBy}-${filters.value.sortOrder}`,
    set: (key: string) => {
      const option = sortOptions.value.find(o => `${o.value}-${o.order}` === key)
      if (option) {
        updateFilters({ sortBy: option.value, sortOrder: option.order, page: 1 })
      }
    },
  })

  const sortItems = computed(() =>
    sortOptions.value.map(o => ({
      label: o.label,
      value: `${o.value}-${o.order}`,
    })),
  )

  return { sortKey, sortItems }
}
