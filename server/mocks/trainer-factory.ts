import type { PersonalTrainer, TrainerModality } from '#shared/domain/catalog/entities/personal-trainer'
import { CATALOG_SPECIALTIES, PROMOTION_LABELS } from '#shared/domain/catalog/constants/catalog-options'
import { getMockAvatarUrl, getMockGalleryUrls } from './mock-photos'
import { pickBrazilianName, pickCity, pickContactPhone } from './seed-data'

const MODALITY_COMBOS: TrainerModality[][] = [
  ['presencial'],
  ['online'],
  ['hibrido'],
  ['presencial', 'online'],
  ['presencial', 'hibrido'],
]

const DESCRIPTIONS = [
  'Personal dedicado a resultados sustentáveis, com foco em técnica e progressão de carga.',
  'Especialista em treinos funcionais para quem busca condicionamento e definição.',
  'Atendimento personalizado para emagrecimento com acompanhamento de hábitos.',
  'Experiência em preparação física para corrida de rua e provas de endurance.',
  'Treinos adaptados para iniciantes, com ênfase em mobilidade e postura.',
  'Abordagem integrada entre força, cardio e recuperação ativa.',
] as const

const AVAILABILITIES = [
  'Seg–Sex, 6h–21h',
  'Seg–Sáb, 7h–20h',
  'Ter–Qui, 8h–18h',
  'Seg–Sex, 6h–12h | Sáb, 8h–14h',
] as const

const REVIEW_COMMENTS = [
  'Excelente profissional, treinos desafiadores e bem explicados.',
  'Muito atencioso e adapta o treino conforme meu dia a dia.',
  'Resultados visíveis em poucas semanas. Recomendo!',
  'Pontual, motivador e sempre disponível para tirar dúvidas.',
] as const

function padId(index: number): string {
  return `trainer-${String(index + 1).padStart(3, '0')}`
}

function pickSpecialty(index: number): string {
  return CATALOG_SPECIALTIES[index % CATALOG_SPECIALTIES.length]!
}

function pickModalities(index: number): TrainerModality[] {
  return MODALITY_COMBOS[index % MODALITY_COMBOS.length]!
}

function generateReviews(index: number): PersonalTrainer['reviews'] {
  const count = (index % 3) + 1
  return Array.from({ length: count }, (_, reviewIndex) => ({
    author: pickBrazilianName(index + reviewIndex + 1000),
    rating: 4 + ((index + reviewIndex) % 2),
    comment: REVIEW_COMMENTS[(index + reviewIndex) % REVIEW_COMMENTS.length]!,
  }))
}

const FEATURED_INDICES = new Set([0, 2, 4, 7, 11, 15])

function buildPromotion(index: number, servicePrice: number): PersonalTrainer['promotion'] {
  if (index % 3 !== 0) {
    return undefined
  }

  const discountFactor = 0.65 + (index % 4) * 0.05
  const promoPrice = Math.round(servicePrice * discountFactor)
  const discountPercent = Math.round((1 - discountFactor) * 100)
  const startsAt = new Date(Date.now() - 3 * 86_400_000).toISOString().slice(0, 10)
  const endsAt = new Date(Date.now() + (index + 14) * 86_400_000).toISOString().slice(0, 10)

  return {
    discountPercent,
    promoPrice,
    label: PROMOTION_LABELS[index % PROMOTION_LABELS.length],
    startsAt,
    endsAt,
    maxRedemptions: 10 + (index % 5) * 5,
    redemptionCount: index % 4,
  }
}

export function generateMockTrainers(count = 36): PersonalTrainer[] {
  return Array.from({ length: count }, (_, index) => {
    const specialty = pickSpecialty(index)
    const location = pickCity(index)
    const modalities = pickModalities(index)
    const servicePrice = 80 + (index * 7) % 171

    return {
      id: padId(index),
      name: pickBrazilianName(index),
      profession: `Personal Trainer — ${specialty}`,
      description: DESCRIPTIONS[index % DESCRIPTIONS.length]!,
      photoUrl: getMockAvatarUrl(index),
      servicePrice,
      contactPhone: pickContactPhone(index, location),
      rating: 3.5 + (index % 16) / 10,
      reviewCount: 5 + (index * 13) % 116,
      distanceKm: 1 + (index * 3) % 25,
      city: location.city,
      state: location.state,
      specialties: [specialty, CATALOG_SPECIALTIES[(index + 1) % CATALOG_SPECIALTIES.length]!],
      modalities,
      cref: `${String(100000 + index).slice(0, 6)}-G/${location.state}`,
      gallery: getMockGalleryUrls(index),
      availability: AVAILABILITIES[index % AVAILABILITIES.length],
      experienceYears: 2 + (index % 15),
      reviews: generateReviews(index),
      featured: FEATURED_INDICES.has(index),
      promotion: buildPromotion(index, servicePrice),
    }
  })
}
