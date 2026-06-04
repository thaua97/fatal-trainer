import type { PersonalTrainer, TrainerModality } from '#shared/domain/catalog/entities/personal-trainer'
import { getMockAvatarUrl, getMockGalleryUrls } from './mock-photos'

const NAMES = [
  'Ana Silva',
  'Bruno Costa',
  'Carla Mendes',
  'Diego Ferreira',
  'Elena Rocha',
  'Felipe Alves',
  'Gabriela Nunes',
  'Henrique Lima',
  'Isabela Martins',
  'João Pedro Souza',
  'Karina Duarte',
  'Lucas Barbosa',
  'Mariana Teixeira',
  'Nicolas Prado',
  'Olivia Campos',
  'Paulo Henrique',
  'Rafaela Moura',
  'Samuel Ribeiro',
  'Tatiana Freitas',
  'Vinícius Araújo',
  'Amanda Lopes',
  'Caio Mendonça',
  'Daniela Pires',
  'Eduardo Santana',
] as const

const SPECIALTIES = [
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

const CITIES = [
  { city: 'São Paulo', state: 'SP' },
  { city: 'Rio de Janeiro', state: 'RJ' },
  { city: 'Belo Horizonte', state: 'MG' },
  { city: 'Curitiba', state: 'PR' },
  { city: 'Porto Alegre', state: 'RS' },
  { city: 'Brasília', state: 'DF' },
  { city: 'Salvador', state: 'BA' },
  { city: 'Recife', state: 'PE' },
] as const

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

function pickName(index: number): string {
  const base = NAMES[index % NAMES.length]!
  if (index < NAMES.length) {
    return base
  }
  return `${base} ${Math.floor(index / NAMES.length) + 1}`
}

function pickSpecialty(index: number): string {
  return SPECIALTIES[index % SPECIALTIES.length]!
}

function pickModalities(index: number): TrainerModality[] {
  return MODALITY_COMBOS[index % MODALITY_COMBOS.length]!
}

function pickCity(index: number): { city: string, state: string } {
  return CITIES[index % CITIES.length]!
}

function generateReviews(index: number): PersonalTrainer['reviews'] {
  const count = (index % 3) + 1
  return Array.from({ length: count }, (_, reviewIndex) => ({
    author: pickName(index + reviewIndex + 5),
    rating: 4 + ((index + reviewIndex) % 2),
    comment: REVIEW_COMMENTS[(index + reviewIndex) % REVIEW_COMMENTS.length]!,
  }))
}

const FEATURED_INDICES = new Set([0, 2, 4, 7, 11, 15])

export function generateMockTrainers(count = 36): PersonalTrainer[] {
  return Array.from({ length: count }, (_, index) => {
    const specialty = pickSpecialty(index)
    const location = pickCity(index)
    const modalities = pickModalities(index)

    return {
      id: padId(index),
      name: pickName(index),
      profession: `Personal Trainer — ${specialty}`,
      description: DESCRIPTIONS[index % DESCRIPTIONS.length]!,
      photoUrl: getMockAvatarUrl(index),
      servicePrice: 80 + (index * 7) % 171,
      rating: 3.5 + (index % 16) / 10,
      reviewCount: 5 + (index * 13) % 116,
      distanceKm: 1 + (index * 3) % 25,
      city: location.city,
      state: location.state,
      specialties: [specialty, SPECIALTIES[(index + 1) % SPECIALTIES.length]!],
      modalities,
      cref: `${String(100000 + index).slice(0, 6)}-G/${location.state}`,
      gallery: getMockGalleryUrls(index),
      availability: AVAILABILITIES[index % AVAILABILITIES.length],
      experienceYears: 2 + (index % 15),
      reviews: generateReviews(index),
      featured: FEATURED_INDICES.has(index),
    }
  })
}
