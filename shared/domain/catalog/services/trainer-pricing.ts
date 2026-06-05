import type { PersonalTrainer } from '../entities/personal-trainer'
import type { PriceView } from '../value-objects/list-query'
import { DEFAULT_PRICE_VIEW } from '../value-objects/list-query'

export const SESSIONS_PER_MONTH = 8

export function isOnPromotion(trainer: PersonalTrainer): boolean {
  return trainer.promotion != null
}

export function convertPriceForView(
  price: number,
  priceView: PriceView = DEFAULT_PRICE_VIEW,
): number {
  if (priceView === 'monthly') {
    return price * SESSIONS_PER_MONTH
  }

  return price
}

export function getEffectivePrice(trainer: PersonalTrainer): number {
  return trainer.promotion?.promoPrice ?? trainer.servicePrice
}

export function getDisplayPrice(
  trainer: PersonalTrainer,
  priceView: PriceView = DEFAULT_PRICE_VIEW,
): number {
  return convertPriceForView(getEffectivePrice(trainer), priceView)
}

export function getDisplayServicePrice(
  trainer: PersonalTrainer,
  priceView: PriceView = DEFAULT_PRICE_VIEW,
): number {
  return convertPriceForView(trainer.servicePrice, priceView)
}

export function getDisplayPromoPrice(
  trainer: PersonalTrainer,
  priceView: PriceView = DEFAULT_PRICE_VIEW,
): number | undefined {
  if (!trainer.promotion) {
    return undefined
  }

  return convertPriceForView(trainer.promotion.promoPrice, priceView)
}

export function getDiscountPercent(trainer: PersonalTrainer): number | null {
  if (!trainer.promotion) {
    return null
  }

  const original = trainer.servicePrice
  if (original <= 0) {
    return null
  }

  const discount = Math.round(((original - trainer.promotion.promoPrice) / original) * 100)
  return discount > 0 ? discount : null
}
