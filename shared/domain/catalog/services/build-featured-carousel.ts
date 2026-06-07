import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

export type FeaturedCarouselMode = 'featured' | 'recommended' | 'hidden'

export interface FeaturedCarouselResult {
  items: PersonalTrainer[]
  mode: FeaturedCarouselMode
}

export function isRatedTrainer(trainer: PersonalTrainer): boolean {
  return (trainer.rating ?? 0) > 0 || (trainer.reviewCount ?? 0) > 0
}

export function buildFeaturedCarouselItems(
  featured: PersonalTrainer[],
  candidates: PersonalTrainer[],
  max = 6,
): FeaturedCarouselResult {
  const featuredIds = new Set(featured.map((trainer) => trainer.id))
  const rated = candidates.filter(
    (trainer) => isRatedTrainer(trainer) && !featuredIds.has(trainer.id),
  )

  if (featured.length > 0) {
    const items = [
      ...featured.slice(0, max),
      ...rated.slice(0, Math.max(0, max - featured.length)),
    ]

    return { items, mode: 'featured' }
  }

  if (rated.length === 0) {
    return { items: [], mode: 'hidden' }
  }

  return { items: rated.slice(0, max), mode: 'recommended' }
}
