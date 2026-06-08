import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { formatPrice } from '#shared/utils/format-price'
import { getEffectivePrice } from '#shared/domain/catalog/services/trainer-pricing'

export function formatTrainerMeta(trainer: PersonalTrainer): {
  title: string
  description: string
} {
  const title = `${trainer.name} — Fatal Trainer`
  const effectivePrice = formatPrice(getEffectivePrice(trainer), 'pt-BR')
  const promoPrefix = trainer.promotion
    ? `A partir de ${effectivePrice}. `
    : ''
  const description = `${promoPrefix}${trainer.profession}. ${trainer.description.slice(0, 120)}`

  return { title, description }
}
