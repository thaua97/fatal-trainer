import type { PriceView } from '#shared/domain/catalog/value-objects/list-query'
import { DEFAULT_PRICE_VIEW } from '#shared/domain/catalog/value-objects/list-query'

export function useFTPriceViewFilter() {
  const { t } = useI18n()
  const { filters, updateFilters } = useTrainerFilters()

  const options = computed(() => [
    { value: 'session' as PriceView, label: t('catalog.priceViewSession') },
    { value: 'monthly' as PriceView, label: t('catalog.priceViewMonthly') },
  ])

  const selected = computed(() => filters.value.priceView ?? DEFAULT_PRICE_VIEW)

  function isSelected(priceView: PriceView) {
    return selected.value === priceView
  }

  function select(priceView: PriceView) {
    updateFilters({
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
