import { describe, expect, it } from 'vitest'
import { mockPromoTrainer, mockTrainer } from '../../helpers/mock-trainer'

describe('mockPromoTrainer', () => {
  it('creates trainer with promotion below service price', () => {
    const trainer = mockPromoTrainer({ servicePrice: 200 })

    expect(trainer.promotion?.promoPrice).toBe(150)
    expect(trainer.promotion?.label).toBe('Primeira sessão')
    expect(trainer.promotion?.endsAt).toBe('2026-06-30')
  })

  it('allows overriding promotion fields', () => {
    const trainer = mockPromoTrainer({
      promotion: { promoPrice: 99, label: 'Black Friday' },
    })

    expect(trainer.promotion?.promoPrice).toBe(99)
    expect(trainer.promotion?.label).toBe('Black Friday')
  })

  it('keeps base trainer defaults', () => {
    const trainer = mockPromoTrainer()

    expect(trainer.name).toBe(mockTrainer().name)
  })
})
