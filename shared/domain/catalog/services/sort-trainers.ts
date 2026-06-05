import type { PersonalTrainer } from '../entities/personal-trainer'
import type { ListQuery, SortBy } from '../value-objects/list-query'
import { getDiscountPercent, getEffectivePrice } from './trainer-pricing'

function compareValues(a: number | string, b: number | string, order: ListQuery['sortOrder']): number {
  if (a === b) return 0
  const result = a < b ? -1 : 1
  return order === 'asc' ? result : -result
}

function getSortValue(trainer: PersonalTrainer, sortBy: SortBy): number | string {
  switch (sortBy) {
    case 'price':
      return getEffectivePrice(trainer)
    case 'rating':
      return trainer.rating ?? 0
    case 'distance':
      return trainer.distanceKm ?? Number.MAX_SAFE_INTEGER
    case 'name':
      return trainer.name.toLowerCase()
    case 'reviewCount':
      return trainer.reviewCount ?? 0
    case 'experienceYears':
      return trainer.experienceYears ?? 0
    case 'discount':
      return getDiscountPercent(trainer) ?? -1
  }
}

export function sortTrainers(
  trainers: PersonalTrainer[],
  sortBy: ListQuery['sortBy'],
  sortOrder: ListQuery['sortOrder'],
): PersonalTrainer[] {
  return [...trainers].sort((a, b) =>
    compareValues(getSortValue(a, sortBy), getSortValue(b, sortBy), sortOrder),
  )
}
