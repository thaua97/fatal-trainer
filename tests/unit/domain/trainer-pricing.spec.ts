import { describe, expect, it } from 'vitest'
import {
  convertPriceForView,
  getDiscountPercent,
  getDisplayPrice,
  getEffectivePrice,
  isOnPromotion,
  SESSIONS_PER_MONTH,
} from '../../../shared/domain/catalog/services/trainer-pricing'
import { mockTrainer } from '../../setup'

describe('trainer-pricing', () => {
  it('returns service price when no promotion', () => {
    const trainer = mockTrainer({ servicePrice: 120 })
    expect(getEffectivePrice(trainer)).toBe(120)
    expect(isOnPromotion(trainer)).toBe(false)
    expect(getDiscountPercent(trainer)).toBeNull()
  })

  it('returns promo price and discount percent', () => {
    const trainer = mockTrainer({
      servicePrice: 200,
      promotion: { promoPrice: 150 },
    })

    expect(getEffectivePrice(trainer)).toBe(150)
    expect(isOnPromotion(trainer)).toBe(true)
    expect(getDiscountPercent(trainer)).toBe(25)
  })

  it('converts session price to monthly view', () => {
    expect(convertPriceForView(120, 'session')).toBe(120)
    expect(convertPriceForView(120, 'monthly')).toBe(120 * SESSIONS_PER_MONTH)
  })

  it('returns display price for monthly view', () => {
    const trainer = mockTrainer({ servicePrice: 100 })
    expect(getDisplayPrice(trainer, 'monthly')).toBe(100 * SESSIONS_PER_MONTH)
  })
})
