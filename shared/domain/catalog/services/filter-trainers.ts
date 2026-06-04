import type { PersonalTrainer } from '../entities/personal-trainer'
import { normalizeSearch } from '#shared/utils/normalize-search'

export function filterTrainers(
  trainers: PersonalTrainer[],
  search?: string,
): PersonalTrainer[] {
  if (!search?.trim()) {
    return trainers
  }

  const term = normalizeSearch(search)

  return trainers.filter((trainer) => {
    const name = normalizeSearch(trainer.name)
    const profession = normalizeSearch(trainer.profession)
    return name.includes(term) || profession.includes(term)
  })
}
