import { computed } from 'vue'
import type { ListQuery } from '../../shared/domain/catalog/value-objects/list-query'
import { storyFiltersComputed, storyUpdateFilters } from './catalog-filter-state'

export function useFTSortSelect() {
  const sortOptions = computed(() => [
    { label: 'Relevância', value: 'name' as ListQuery['sortBy'], order: 'asc' as ListQuery['sortOrder'] },
    { label: 'Menor preço', value: 'price' as ListQuery['sortBy'], order: 'asc' as ListQuery['sortOrder'] },
    { label: 'Maior desconto', value: 'discount' as ListQuery['sortBy'], order: 'desc' as ListQuery['sortOrder'] },
  ])

  const sortKey = computed({
    get: () => `${storyFiltersComputed.value.sortBy}-${storyFiltersComputed.value.sortOrder}`,
    set: (key: string) => {
      const option = sortOptions.value.find(o => `${o.value}-${o.order}` === key)
      if (option) {
        storyUpdateFilters({ sortBy: option.value, sortOrder: option.order, page: 1 })
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
