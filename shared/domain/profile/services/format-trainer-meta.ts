import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

export function formatTrainerMeta(trainer: PersonalTrainer): {
  title: string
  description: string
} {
  const title = `${trainer.name} — Fatal Trainer`
  const description = `${trainer.profession}. ${trainer.description.slice(0, 140)}`

  return { title, description }
}
