import type { AuthUser, UserRole } from '#shared/domain/auth/entities/user'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

export interface PaginatedTrainersResponse {
  items: PersonalTrainer[]
  total: number
  page: number
  pageSize: number
  hasMore?: boolean
}

export interface TrainerDetailResponse {
  trainer: PersonalTrainer
}

export interface FeaturedTrainersResponse {
  items: PersonalTrainer[]
}

export interface CreateReportRequest {
  type: string
  occurredAt: string
  trainerId: string
  description: string
  contactEmail: string
}

export interface CreateReportResponse {
  id: string
  createdAt: string
}

export interface CreateReportErrorResponse {
  message: string
  errors: Record<string, string>
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
  termsAccepted: boolean
}

export interface AuthSessionResponse {
  user: AuthUser
}

export interface AuthErrorResponse {
  message: string
  errors: Record<string, string>
}

export interface MyTrainerResponse {
  trainer: PersonalTrainer
  created: boolean
}

export interface UpdateTrainerProfileRequest {
  section: 'info' | 'promotion'
  info?: {
    name: string
    contactPhone: string
    profession: string
    description: string
    specialties: string[]
    modalities: PersonalTrainer['modalities']
    city: string
    state: string
    servicePrice: number
    cref: string
    availability: string
    experienceYears: number
  }
  promotion?: {
    active: boolean
    discountPercent: number
    label: string
    startsAt: string
    endsAt: string
    maxRedemptions: number | null
  }
}

export interface UploadGalleryResponse {
  url: string
  gallery: string[]
}

export interface BookmakersSyncRequest {
  trainerIds: string[]
}

export interface BookmakersSyncResponse {
  synced: number
}

export interface TrainerReviewItem {
  id: string
  author: string
  rating: number
  comment: string
  createdAt: string
  updatedAt?: string
}

export interface PaginatedReviewsResponse {
  items: TrainerReviewItem[]
  total: number
  page: number
  pageSize: number
}

export interface UpsertReviewRequest {
  rating: number
  comment: string
}

export interface UpsertReviewResponse {
  review: TrainerReviewItem
  created: boolean
}

export interface MyReviewResponse {
  review: TrainerReviewItem | null
}
