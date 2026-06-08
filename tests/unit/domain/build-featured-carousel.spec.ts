import { describe, it, expect } from 'vitest'
import {
  buildFeaturedCarouselItems,
  isRatedTrainer,
} from '../../../shared/domain/catalog/services/build-featured-carousel'
import { mockTrainer } from '../../helpers/mock-trainer'

describe('isRatedTrainer', () => {
  it('returns true when rating is positive', () => {
    expect(isRatedTrainer(mockTrainer({ rating: 4.5, reviewCount: 0 }))).toBe(true)
  })

  it('returns true when reviewCount is positive', () => {
    expect(isRatedTrainer(mockTrainer({ rating: 0, reviewCount: 3 }))).toBe(true)
  })

  it('returns false when neither rating nor reviewCount is set', () => {
    expect(isRatedTrainer(mockTrainer({ rating: undefined, reviewCount: undefined }))).toBe(false)
  })
})

describe('buildFeaturedCarouselItems', () => {
  const featured = [
    mockTrainer({ id: 'f1', name: 'Featured 1', featured: true }),
    mockTrainer({ id: 'f2', name: 'Featured 2', featured: true }),
  ]

  const rated = Array.from({ length: 10 }, (_, index) =>
    mockTrainer({ id: `r${index}`, name: `Rated ${index}`, rating: 5 - index * 0.1 }),
  )

  it('places featured first and fills up to max with rated trainers', () => {
    const result = buildFeaturedCarouselItems(featured, rated, 6)

    expect(result.mode).toBe('featured')
    expect(result.items).toHaveLength(6)
    expect(result.items[0]?.id).toBe('f1')
    expect(result.items[1]?.id).toBe('f2')
    expect(result.items[2]?.id).toBe('r0')
  })

  it('returns recommended mode when no featured trainers exist', () => {
    const result = buildFeaturedCarouselItems([], rated.slice(0, 4), 6)

    expect(result.mode).toBe('recommended')
    expect(result.items).toHaveLength(4)
    expect(result.items.every((trainer) => trainer.id.startsWith('r'))).toBe(true)
  })

  it('returns hidden mode when no featured and no rated trainers exist', () => {
    const unrated = [
      mockTrainer({ id: 'u1', rating: undefined, reviewCount: undefined }),
    ]

    const result = buildFeaturedCarouselItems([], unrated, 6)

    expect(result.mode).toBe('hidden')
    expect(result.items).toHaveLength(0)
  })

  it('deduplicates featured ids from rated candidates', () => {
    const overlapping = [
      mockTrainer({ id: 'f1', name: 'Also in rated', rating: 4.9 }),
      ...rated,
    ]

    const result = buildFeaturedCarouselItems(featured, overlapping, 6)

    expect(result.items.filter((trainer) => trainer.id === 'f1')).toHaveLength(1)
    expect(result.items[0]?.id).toBe('f1')
  })
})
