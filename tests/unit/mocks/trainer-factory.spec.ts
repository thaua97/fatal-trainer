import { describe, expect, it } from 'vitest'
import { generateMockTrainers } from '../../../server/mocks/trainer-factory'

describe('generateMockTrainers', () => {
  const trainers = generateMockTrainers(36)

  it('generates the requested number of trainers', () => {
    expect(trainers).toHaveLength(36)
  })

  it('assigns unique ids', () => {
    const ids = trainers.map((trainer) => trainer.id)
    expect(new Set(ids).size).toBe(36)
    expect(ids[0]).toBe('trainer-001')
    expect(ids[35]).toBe('trainer-036')
  })

  it('uses Pexels placeholder photos', () => {
    for (const trainer of trainers) {
      expect(trainer.photoUrl).toContain('images.pexels.com/photos/')
    }
  })

  it('fills required fields', () => {
    for (const trainer of trainers) {
      expect(trainer.name).toBeTruthy()
      expect(trainer.profession).toMatch(/^Personal Trainer — /)
      expect(trainer.description).toBeTruthy()
      expect(trainer.servicePrice).toBeGreaterThan(0)
      expect(trainer.gallery?.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('includes optional profile fields', () => {
    const trainer = trainers[0]!

    expect(trainer.rating).toBeGreaterThanOrEqual(3.5)
    expect(trainer.reviewCount).toBeGreaterThan(0)
    expect(trainer.city).toBeTruthy()
    expect(trainer.state).toBeTruthy()
    expect(trainer.modalities?.length).toBeGreaterThan(0)
    expect(trainer.reviews?.length).toBeGreaterThan(0)
  })

  it('marks selected trainers as featured', () => {
    const featured = trainers.filter((trainer) => trainer.featured === true)

    expect(featured.length).toBe(6)
    expect(featured.every((trainer) => (trainer.rating ?? 0) >= 3.5)).toBe(true)
  })
})
