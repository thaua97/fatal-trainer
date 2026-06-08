import { describe, expect, it } from 'vitest'
import type { TrainerInfoPayload, TrainerPromotionPayload } from '../../../shared/domain/catalog/entities/trainer-profile-payloads'
import { validateTrainerInfo, validateTrainerPromotion } from '../../../shared/domain/catalog/services/validate-trainer-profile'

function validInfo(overrides: Partial<TrainerInfoPayload> = {}): TrainerInfoPayload {
  return {
    name: 'Carlos Personal',
    contactPhone: '(11) 98765-4321',
    profession: 'Personal Trainer — Funcional',
    description: 'Especialista em treino funcional com foco em resultados sustentáveis.',
    specialties: ['Funcional'],
    modalities: ['presencial'],
    city: 'São Paulo',
    state: 'SP',
    servicePrice: 120,
    cref: '123456-G/SP',
    availability: 'Seg–Sex, 7h–20h',
    experienceYears: 5,
    ...overrides,
  }
}

function validPromotion(overrides: Partial<TrainerPromotionPayload> = {}): TrainerPromotionPayload {
  return {
    active: true,
    discountPercent: 20,
    label: 'Primeira sessão',
    startsAt: '2026-01-01',
    endsAt: '2026-12-31',
    maxRedemptions: 10,
    ...overrides,
  }
}

describe('validateTrainerInfo', () => {
  it('accepts valid payload', () => {
    const result = validateTrainerInfo(validInfo())
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('requires name', () => {
    const result = validateTrainerInfo(validInfo({ name: '' }))
    expect(result.errors.name).toBe('required')
  })

  it('validates phone digits', () => {
    const result = validateTrainerInfo(validInfo({ contactPhone: '123' }))
    expect(result.errors.contactPhone).toBe('invalid')
  })

  it('validates cref format', () => {
    const result = validateTrainerInfo(validInfo({ cref: 'wqweqweqw' }))
    expect(result.errors.cref).toBe('invalid')
  })

  it('requires specialties and modalities', () => {
    const result = validateTrainerInfo(validInfo({ specialties: [], modalities: [] }))
    expect(result.errors.specialties).toBe('required')
    expect(result.errors.modalities).toBe('required')
  })

  it('validates service price', () => {
    const result = validateTrainerInfo(validInfo({ servicePrice: 0 }))
    expect(result.errors.servicePrice).toBe('invalid')
  })
})

describe('validateTrainerPromotion', () => {
  it('skips validation when inactive', () => {
    const result = validateTrainerPromotion(validPromotion({ active: false }), 120)
    expect(result.valid).toBe(true)
  })

  it('requires valid discount percent', () => {
    const result = validateTrainerPromotion(validPromotion({ discountPercent: 2 }), 120)
    expect(result.errors.discountPercent).toBe('invalid')
  })

  it('requires end date after start date', () => {
    const result = validateTrainerPromotion(validPromotion({
      startsAt: '2026-06-01',
      endsAt: '2026-05-01',
    }), 120)
    expect(result.errors.endsAt).toBe('beforeStart')
  })

  it('requires service price when active', () => {
    const result = validateTrainerPromotion(validPromotion(), 0)
    expect(result.errors.active).toBe('noServicePrice')
  })
})
