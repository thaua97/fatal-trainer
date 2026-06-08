import type { TrainerModality } from '../entities/personal-trainer'

export const CATALOG_SPECIALTIES = [
  'Musculação',
  'Funcional',
  'HIIT',
  'CrossFit',
  'Emagrecimento',
  'Yoga',
  'Pilates',
  'Corrida',
  'Reabilitação',
  'Treino para idosos',
] as const

export type CatalogSpecialty = (typeof CATALOG_SPECIALTIES)[number]

export const CATALOG_MODALITIES: TrainerModality[] = [
  'presencial',
  'online',
  'hibrido',
]

export const PROMOTION_LABELS = [
  'Primeira sessão',
  'Pacote mensal',
  'Oferta de lançamento',
] as const
