import { describe, expect, it } from 'vitest'
import {
  validateTrainerInfo,
  validateTrainerPromotion,
  validateTrainerPromotionActivation,
} from '../../../shared/domain/catalog/services/validate-trainer-profile'

function validInfo() {
  return {
    name: 'Ana Silva',
    contactPhone: '11999999999',
    profession: 'Personal Trainer — HIIT',
    description: 'Descrição completa com mais de vinte caracteres.',
    specialties: ['HIIT'],
    modalities: ['presencial'] as const,
    city: 'São Paulo',
    state: 'SP',
    servicePrice: 120,
    cref: '123456-G/SP',
    availability: 'Seg–Sex 8h–18h',
    experienceYears: 5,
  }
}

describe('validateTrainerInfo', () => {
  it('rejects invalid trainer info', () => {
    const result = validateTrainerInfo({
      ...validInfo(),
      name: '',
      servicePrice: 0,
      experienceYears: -1,
    })

    expect(result.valid).toBe(false)
  })

  it('accepts valid trainer info', () => {
    const result = validateTrainerInfo(validInfo())
    expect(result.valid).toBe(true)
  })
})

describe('validateTrainerPromotion', () => {
  it('accepts inactive promotion', () => {
    const result = validateTrainerPromotion({
      active: false,
      discountPercent: 0,
      label: '',
      startsAt: '',
      endsAt: '',
      maxRedemptions: null,
    }, 120)

    expect(result.valid).toBe(true)
  })

  it('rejects active promotion with invalid fields', () => {
    const result = validateTrainerPromotion({
      active: true,
      discountPercent: 2,
      label: '',
      startsAt: 'invalid',
      endsAt: '2026-01-01',
      maxRedemptions: 0,
    }, 120)

    expect(result.valid).toBe(false)
    expect(result.errors.discountPercent).toBe('invalid')
    expect(result.errors.label).toBe('required')
    expect(result.errors.startsAt).toBe('invalid')
    expect(result.errors.maxRedemptions).toBe('invalid')
  })

  it('accepts valid active promotion', () => {
    const result = validateTrainerPromotion({
      active: true,
      discountPercent: 20,
      label: 'Primeira sessão',
      startsAt: '2026-01-01',
      endsAt: '2026-12-31',
      maxRedemptions: null,
    }, 120)

    expect(result.valid).toBe(true)
  })
})

describe('validateTrainerPromotionActivation', () => {
  it('accepts deactivation', () => {
    const result = validateTrainerPromotionActivation({ templateId: null }, 120)
    expect(result.valid).toBe(true)
  })

  it('accepts valid template activation', () => {
    const result = validateTrainerPromotionActivation({ templateId: 'promo-id' }, 120)
    expect(result.valid).toBe(true)
  })

  it('rejects activation without service price', () => {
    const result = validateTrainerPromotionActivation({ templateId: 'promo-id' }, 0)
    expect(result.valid).toBe(false)
    expect(result.errors.templateId).toBe('noServicePrice')
  })
})
