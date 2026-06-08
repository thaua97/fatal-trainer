import type { PersonalTrainer } from '../entities/personal-trainer'
import type { ListQuery } from '../value-objects/list-query'
import { normalizeSearch } from '#shared/utils/normalize-search'
import { isOnPromotion } from './trainer-pricing'

export type TrainerFilterQuery = Pick<
  ListQuery,
  'search' | 'specialties' | 'modalities' | 'onPromotion' | 'city'
>

function matchesSearch(trainer: PersonalTrainer, term: string): boolean {
  const name = normalizeSearch(trainer.name)
  const profession = normalizeSearch(trainer.profession)
  const specialties = (trainer.specialties ?? [])
    .map((specialty) => normalizeSearch(specialty))
    .join(' ')

  return name.includes(term) || profession.includes(term) || specialties.includes(term)
}

function matchesSpecialties(trainer: PersonalTrainer, specialties: string[]): boolean {
  if (!specialties.length) {
    return true
  }

  const trainerSpecialties = trainer.specialties ?? []
  return specialties.some((specialty) => trainerSpecialties.includes(specialty))
}

function matchesModalities(trainer: PersonalTrainer, modalities: string[]): boolean {
  if (!modalities.length) {
    return true
  }

  const trainerModalities = trainer.modalities ?? []
  return modalities.some((modality) =>
    trainerModalities.includes(modality as NonNullable<PersonalTrainer['modalities']>[number]),
  )
}

function matchesPromotion(trainer: PersonalTrainer, onPromotion?: boolean): boolean {
  if (onPromotion !== true) {
    return true
  }

  return isOnPromotion(trainer)
}

function matchesCity(trainer: PersonalTrainer, city?: string): boolean {
  if (!city?.trim()) {
    return true
  }

  return normalizeSearch(trainer.city ?? '') === normalizeSearch(city)
}

export function filterTrainers(
  trainers: PersonalTrainer[],
  query: TrainerFilterQuery = {},
): PersonalTrainer[] {
  const { search, specialties, modalities, onPromotion, city } = query

  return trainers.filter((trainer) => {
    if (search?.trim()) {
      const term = normalizeSearch(search)
      if (!matchesSearch(trainer, term)) {
        return false
      }
    }

    if (!matchesSpecialties(trainer, specialties ?? [])) {
      return false
    }

    if (!matchesModalities(trainer, modalities ?? [])) {
      return false
    }

    if (!matchesPromotion(trainer, onPromotion)) {
      return false
    }

    if (!matchesCity(trainer, city)) {
      return false
    }

    return true
  })
}
