import { describe, expect, it } from 'vitest'
import { sortTrainers } from '../../../shared/domain/catalog/services/sort-trainers'
import { mockTrainer } from '../../setup'

describe('sortTrainers', () => {
  const trainers = [
    mockTrainer({
      id: '1',
      name: 'Bruno',
      servicePrice: 150,
      rating: 4.2,
      reviewCount: 20,
      distanceKm: 10,
      experienceYears: 5,
    }),
    mockTrainer({
      id: '2',
      name: 'Ana',
      servicePrice: 120,
      rating: 4.8,
      reviewCount: 80,
      distanceKm: 2,
      experienceYears: 10,
      promotion: { promoPrice: 90 },
    }),
    mockTrainer({
      id: '3',
      name: 'Carla',
      servicePrice: 200,
      rating: 3.9,
      reviewCount: 5,
      distanceKm: 15,
      experienceYears: 2,
    }),
  ]

  it('sorts by effective price ascending', () => {
    const result = sortTrainers(trainers, 'price', 'asc')
    expect(result.map((trainer) => trainer.id)).toEqual(['2', '1', '3'])
  })

  it('sorts by rating descending', () => {
    const result = sortTrainers(trainers, 'rating', 'desc')
    expect(result.map((trainer) => trainer.id)).toEqual(['2', '1', '3'])
  })

  it('sorts by review count descending', () => {
    const result = sortTrainers(trainers, 'reviewCount', 'desc')
    expect(result.map((trainer) => trainer.id)).toEqual(['2', '1', '3'])
  })

  it('sorts by name descending', () => {
    const result = sortTrainers(trainers, 'name', 'desc')
    expect(result.map((trainer) => trainer.name)).toEqual(['Carla', 'Bruno', 'Ana'])
  })

  it('sorts by discount descending', () => {
    const result = sortTrainers(trainers, 'discount', 'desc')
    expect(result[0]?.id).toBe('2')
  })

  it('sorts by experience years descending', () => {
    const result = sortTrainers(trainers, 'experienceYears', 'desc')
    expect(result.map((trainer) => trainer.id)).toEqual(['2', '1', '3'])
  })
})
