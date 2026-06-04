import { describe, expect, it } from 'vitest'
import { filterTrainers } from '../../../shared/domain/catalog/services/filter-trainers'
import { mockTrainer } from '../../setup'

describe('filterTrainers', () => {
  const trainers = [
    mockTrainer({ id: '1', name: 'Ana Silva', profession: 'Personal Trainer — Funcional' }),
    mockTrainer({ id: '2', name: 'Bruno Costa', profession: 'Personal Trainer — Musculação' }),
    mockTrainer({ id: '3', name: 'Carla Mendes', profession: 'Personal Trainer — CrossFit' }),
  ]

  it('returns all trainers when search is empty', () => {
    expect(filterTrainers(trainers)).toHaveLength(3)
    expect(filterTrainers(trainers, '   ')).toHaveLength(3)
  })

  it('filters by name (case insensitive)', () => {
    const result = filterTrainers(trainers, 'ana')
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Ana Silva')
  })

  it('filters by profession', () => {
    const result = filterTrainers(trainers, 'crossfit')
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Carla Mendes')
  })
})
