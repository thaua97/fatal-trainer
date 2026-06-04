import { describe, expect, it } from 'vitest'
import { generateMockTrainers } from '../../../server/mocks/trainer-factory'
import { findFeaturedTrainers } from '../../../server/services/trainer-repository'

describe('findFeaturedTrainers', () => {
  it('returns only featured trainers sorted by rating', () => {
    const trainers = findFeaturedTrainers()

    expect(trainers.length).toBeGreaterThan(0)
    expect(trainers.length).toBeLessThanOrEqual(6)
    expect(trainers.every((trainer) => trainer.featured === true)).toBe(true)

    for (let index = 1; index < trainers.length; index += 1) {
      expect(trainers[index - 1]!.rating ?? 0).toBeGreaterThanOrEqual(trainers[index]!.rating ?? 0)
    }
  })

  it('respects the limit parameter', () => {
    generateMockTrainers(36)
    expect(findFeaturedTrainers(2)).toHaveLength(2)
  })
})
