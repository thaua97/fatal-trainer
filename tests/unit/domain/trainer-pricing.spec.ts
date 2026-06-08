import { describe, expect, it } from 'vitest'
import {
  computePromoPrice,
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
      promotion: {
        discountPercent: 25,
        promoPrice: 150,
        startsAt: '2020-01-01',
        endsAt: '2099-12-31',
      },
    })

    expect(getEffectivePrice(trainer)).toBe(150)
    expect(isOnPromotion(trainer)).toBe(true)
    expect(getDiscountPercent(trainer)).toBe(25)
  })

  it('computes promo price from discount percent', () => {
    expect(computePromoPrice(200, 25)).toBe(150)
  })

  it('returns false when promotion is outside date range', () => {
    const trainer = mockTrainer({
      promotion: {
        discountPercent: 20,
        promoPrice: 80,
        startsAt: '2020-01-01',
        endsAt: '2020-01-31',
      },
    })

    expect(isOnPromotion(trainer, '2026-06-01')).toBe(false)
    expect(getEffectivePrice(trainer, '2026-06-01')).toBe(trainer.servicePrice)
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
