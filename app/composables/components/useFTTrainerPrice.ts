import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import {
  convertPriceForView,
  getDiscountPercent,
} from '#shared/domain/catalog/services/trainer-pricing'
import { DEFAULT_PRICE_VIEW } from '#shared/domain/catalog/value-objects/list-query'

export function useFTTrainerPrice(trainer: Ref<PersonalTrainer> | PersonalTrainer) {
  const trainerRef = isRef(trainer) ? trainer : ref(trainer)
  const { filters } = useTrainerFilters()

  const priceView = computed(() => filters.value.priceView ?? DEFAULT_PRICE_VIEW)

  const servicePrice = computed(() =>
    convertPriceForView(trainerRef.value.servicePrice, priceView.value),
  )

  const promoPrice = computed(() => {
    const rawPromo = trainerRef.value.promotion?.promoPrice
    if (rawPromo == null) {
      return undefined
    }

    return convertPriceForView(rawPromo, priceView.value)
  })

  const sessionServicePrice = computed(() =>
    convertPriceForView(trainerRef.value.servicePrice, 'session'),
  )

  const monthlyServicePrice = computed(() =>
    convertPriceForView(trainerRef.value.servicePrice, 'monthly'),
  )

  const sessionPromoPrice = computed(() => {
    const rawPromo = trainerRef.value.promotion?.promoPrice
    if (rawPromo == null) {
      return undefined
    }

    return convertPriceForView(rawPromo, 'session')
  })

  const monthlyPromoPrice = computed(() => {
    const rawPromo = trainerRef.value.promotion?.promoPrice
    if (rawPromo == null) {
      return undefined
    }

    return convertPriceForView(rawPromo, 'monthly')
  })

  const hasPromotion = computed(() => promoPrice.value != null)
  const discountPercent = computed(() => getDiscountPercent(trainerRef.value))
  const promotionLabel = computed(() => trainerRef.value.promotion?.label)
  const promotionEndsAt = computed(() => trainerRef.value.promotion?.endsAt)

  const promotionNote = computed(() => {
    const parts: string[] = []
    if (promotionLabel.value) {
      parts.push(promotionLabel.value)
    }
    if (promotionEndsAt.value) {
      parts.push(promotionEndsAt.value)
    }
    return parts.join(' · ')
  })

  return {
    servicePrice,
    promoPrice,
    sessionServicePrice,
    sessionPromoPrice,
    monthlyServicePrice,
    monthlyPromoPrice,
    hasPromotion,
    discountPercent,
    promotionLabel,
    promotionEndsAt,
    promotionNote,
    priceView,
  }
}
