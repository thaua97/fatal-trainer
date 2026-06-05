import { computed } from 'vue'
import type { PriceView } from '../../shared/domain/catalog/value-objects/list-query'
import { DEFAULT_PRICE_VIEW } from '../../shared/domain/catalog/value-objects/list-query'
import { storyFiltersComputed, storyUpdateFilters } from './catalog-filter-state'

export function useFTPriceViewFilter() {
  const options = computed(() => [
    { value: 'session' as PriceView, label: 'Por sessão' },
    { value: 'monthly' as PriceView, label: 'Mensal' },
  ])

  const selected = computed(() => storyFiltersComputed.value.priceView ?? DEFAULT_PRICE_VIEW)

  function isSelected(priceView: PriceView) {
    return selected.value === priceView
  }

  function select(priceView: PriceView) {
    storyUpdateFilters({
      priceView: priceView === DEFAULT_PRICE_VIEW ? undefined : priceView,
      page: 1,
    })
  }

  return {
    options,
    selected,
    isSelected,
    select,
  }
}
