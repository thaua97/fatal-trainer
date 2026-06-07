import { describe, expect, it } from 'vitest'
import { generateMockTrainers } from '../../../server/mocks/trainer-factory'
import { findTrainersByIds } from '../../../server/services/trainer-repository'

describe('findTrainersByIds', () => {
  it('returns paginated trainers matching the provided ids', () => {
    const trainers = generateMockTrainers(5)
    const ids = [trainers[0]!.id, trainers[2]!.id, trainers[4]!.id]

    const response = findTrainersByIds(ids, 1, 2)

    expect(response.total).toBe(3)
    expect(response.items).toHaveLength(2)
    expect(response.items.every((trainer) => ids.includes(trainer.id))).toBe(true)
  })

  it('returns empty result for unknown ids', () => {
    const response = findTrainersByIds(['missing-id'], 1, 10)
    expect(response.total).toBe(0)
    expect(response.items).toEqual([])
  })
})
