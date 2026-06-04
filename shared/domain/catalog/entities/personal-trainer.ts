export type TrainerModality = 'presencial' | 'online' | 'hibrido'

export interface TrainerReview {
  author: string
  rating: number
  comment: string
}

export interface PersonalTrainer {
  id: string
  name: string
  profession: string
  description: string
  photoUrl: string
  servicePrice: number
  rating?: number
  reviewCount?: number
  distanceKm?: number
  city?: string
  state?: string
  specialties?: string[]
  modalities?: TrainerModality[]
  cref?: string
  gallery?: string[]
  availability?: string
  experienceYears?: number
  reviews?: TrainerReview[]
  featured?: boolean
}
