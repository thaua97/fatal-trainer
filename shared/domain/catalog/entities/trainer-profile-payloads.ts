import type { TrainerModality } from './personal-trainer'

export type TrainerInfoField =
  | 'name'
  | 'contactPhone'
  | 'profession'
  | 'description'
  | 'specialties'
  | 'modalities'
  | 'city'
  | 'state'
  | 'servicePrice'
  | 'cref'
  | 'availability'
  | 'experienceYears'

export type TrainerPromotionField =
  | 'discountPercent'
  | 'label'
  | 'startsAt'
  | 'endsAt'
  | 'maxRedemptions'
  | 'active'

export interface TrainerInfoPayload {
  name: string
  contactPhone: string
  profession: string
  description: string
  specialties: string[]
  modalities: TrainerModality[]
  city: string
  state: string
  servicePrice: number
  cref: string
  availability: string
  experienceYears: number
}

export interface TrainerPromotionPayload {
  active: boolean
  discountPercent: number
  label: string
  startsAt: string
  endsAt: string
  maxRedemptions: number | null
}

export interface TrainerPromotionActivationPayload {
  templateId: string | null
}

export type TrainerInfoValidationErrors = Partial<Record<TrainerInfoField, string>>
export type TrainerPromotionValidationErrors = Partial<
  Record<TrainerPromotionField | keyof TrainerPromotionActivationPayload, string>
>

export interface TrainerProfileValidationResult<T extends Record<string, string | undefined>> {
  valid: boolean
  errors: T
}
