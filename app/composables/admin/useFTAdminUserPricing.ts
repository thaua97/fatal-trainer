import type { AdminUserListItem } from '#shared/types/admin'
import { convertPriceForView } from '#shared/domain/catalog/services/trainer-pricing'

export function useFTAdminUserPricing(user: Ref<AdminUserListItem> | AdminUserListItem) {
  const userRef = isRef(user) ? user : ref(user)

  function toPrice(value: number | undefined): number | undefined {
    if (value == null) return undefined
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  const sessionPrice = computed(() => toPrice(userRef.value.servicePrice))
  const monthlyPrice = computed(() =>
    sessionPrice.value != null
      ? convertPriceForView(sessionPrice.value, 'monthly')
      : undefined,
  )
  const sessionPromoPrice = computed(() => toPrice(userRef.value.promoPrice))
  const monthlyPromoPrice = computed(() =>
    sessionPromoPrice.value != null
      ? convertPriceForView(sessionPromoPrice.value, 'monthly')
      : undefined,
  )
  const hasPricing = computed(() => userRef.value.role === 'personal-trainer' && sessionPrice.value != null)

  return {
    sessionPrice,
    monthlyPrice,
    sessionPromoPrice,
    monthlyPromoPrice,
    hasPricing,
  }
}
