import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

export interface PaginatedTrainersResponse {
  items: PersonalTrainer[]
  total: number
  page: number
  pageSize: number
}

export interface TrainerDetailResponse {
  trainer: PersonalTrainer
}

export interface FeaturedTrainersResponse {
  items: PersonalTrainer[]
}
