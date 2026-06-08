import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { loadTrainers, saveTrainers } from './trainer-repository-storage'

export function mutateTrainer(
  trainerId: string,
  mutator: (trainer: PersonalTrainer) => PersonalTrainer,
): PersonalTrainer {
  const trainers = loadTrainers()
  const index = trainers.findIndex((trainer) => trainer.id === trainerId)

  if (index === -1) {
    throw new Error('Trainer not found')
  }

  const updated = mutator(trainers[index]!)
  const next = [...trainers]
  next[index] = updated
  saveTrainers(next)
  return updated
}
