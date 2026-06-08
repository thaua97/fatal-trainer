import type { Ref } from 'vue'
import type { PriceView } from '#shared/domain/catalog/value-objects/list-query'
import { SESSIONS_PER_MONTH } from '#shared/domain/catalog/services/trainer-pricing'

export function useFTProfilePriceInput(servicePrice: Ref<number>) {
  const { t } = useI18n()
  const priceView = ref<PriceView>('session')

  const priceViewOptions = computed(() => [
    { value: 'session' as PriceView, label: t('catalog.priceViewSession') },
    { value: 'monthly' as PriceView, label: t('catalog.priceViewMonthly') },
  ])

  const displayPrice = computed({
    get() {
      if (priceView.value === 'monthly') {
        return servicePrice.value * SESSIONS_PER_MONTH
      }

      return servicePrice.value
    },
    set(value: number) {
      const normalized = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0

      if (priceView.value === 'monthly') {
        servicePrice.value = normalized > 0
          ? Math.max(1, Math.round(normalized / SESSIONS_PER_MONTH))
          : 0
        return
      }

      servicePrice.value = normalized
    },
  })

  const periodLabel = computed(() =>
    priceView.value === 'monthly' ? t('profile.perMonth') : t('profile.perSession'),
  )

  const priceHint = computed(() =>
    priceView.value === 'monthly'
      ? t('dashboard.edit.pricingMonthlyHint', { sessions: SESSIONS_PER_MONTH })
      : t('dashboard.edit.pricingSessionHint'),
  )

  function selectPriceView(view: PriceView) {
    priceView.value = view
  }

  function isPriceViewSelected(view: PriceView) {
    return priceView.value === view
  }

  return {
    priceView,
    priceViewOptions,
    displayPrice,
    periodLabel,
    priceHint,
    selectPriceView,
    isPriceViewSelected,
  }
}
