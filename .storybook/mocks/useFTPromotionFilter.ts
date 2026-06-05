import { computed } from 'vue'
import { storyFiltersComputed, storyUpdateFilters } from './catalog-filter-state'

export function useFTPromotionFilter() {
  const onPromotion = computed({
    get: () => storyFiltersComputed.value.onPromotion === true,
    set: (value: boolean) => {
      storyUpdateFilters({
        onPromotion: value ? true : undefined,
        page: 1,
      })
    },
  })

  const label = computed(() => 'Apenas em promoção')

  return { onPromotion, label }
}
