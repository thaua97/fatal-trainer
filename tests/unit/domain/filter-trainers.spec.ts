import { describe, expect, it } from 'vitest'
import { filterTrainers } from '../../../shared/domain/catalog/services/filter-trainers'
import { mockTrainer } from '../../setup'

describe('filterTrainers', () => {
  const trainers = [
    mockTrainer({
      id: '1',
      name: 'Ana Silva',
      profession: 'Personal Trainer — Funcional',
      specialties: ['Funcional', 'HIIT'],
      modalities: ['presencial'],
      promotion: { promoPrice: 90 },
    }),
    mockTrainer({
      id: '2',
      name: 'Bruno Costa',
      profession: 'Personal Trainer — Musculação',
      specialties: ['Musculação'],
      modalities: ['online'],
    }),
    mockTrainer({
      id: '3',
      name: 'Carla Mendes',
      profession: 'Personal Trainer — CrossFit',
      specialties: ['CrossFit'],
      modalities: ['hibrido'],
    }),
  ]

  it('returns all trainers when query is empty', () => {
    expect(filterTrainers(trainers)).toHaveLength(3)
    expect(filterTrainers(trainers, { search: '   ' })).toHaveLength(3)
  })

  it('filters by name (case insensitive)', () => {
    const result = filterTrainers(trainers, { search: 'ana' })
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Ana Silva')
  })

  it('filters by profession', () => {
    const result = filterTrainers(trainers, { search: 'crossfit' })
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Carla Mendes')
  })

  it('filters by specialty in search', () => {
    const result = filterTrainers(trainers, { search: 'hiit' })
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Ana Silva')
  })

  it('filters by specialties array', () => {
    const result = filterTrainers(trainers, { specialties: ['Musculação', 'CrossFit'] })
    expect(result).toHaveLength(2)
    expect(result.map((trainer) => trainer.name)).toEqual(['Bruno Costa', 'Carla Mendes'])
  })

  it('filters by modalities array', () => {
    const result = filterTrainers(trainers, { modalities: ['online', 'hibrido'] })
    expect(result).toHaveLength(2)
  })

  it('filters by city (accent and case insensitive)', () => {
    const list = [
      mockTrainer({ id: '1', name: 'A', city: 'São Paulo' }),
      mockTrainer({ id: '2', name: 'B', city: 'Santos' }),
    ]

    const result = filterTrainers(list, { city: 'sao paulo' })

    expect(result).toHaveLength(1)
    expect(result[0]?.city).toBe('São Paulo')
  })

  it('ignores a blank city filter', () => {
    const list = [
      mockTrainer({ id: '1', name: 'A', city: 'São Paulo' }),
      mockTrainer({ id: '2', name: 'B', city: 'Santos' }),
    ]

    expect(filterTrainers(list, { city: '  ' })).toHaveLength(2)
  })

  it('filters by onPromotion', () => {
    const result = filterTrainers(trainers, { onPromotion: true })
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Ana Silva')
  })

  it('combines filters', () => {
    const result = filterTrainers(trainers, {
      specialties: ['Funcional'],
      modalities: ['presencial'],
      onPromotion: true,
    })
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Ana Silva')
  })
})
