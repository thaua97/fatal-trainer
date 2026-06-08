import type { AuthUser } from '#shared/domain/auth/entities/user'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type {
  TrainerInfoPayload,
  TrainerPromotionActivationPayload,
} from '#shared/domain/catalog/entities/trainer-profile-payloads'
import { hydratePromotionFromTemplate } from '#shared/domain/catalog/services/promotion-hydration'
import { findPromotionTemplateById } from '../mocks/mock-promotion-templates'
import type { ListQuery } from '#shared/domain/catalog/value-objects/list-query'
import { computeDiscountPercent, computePromoPrice } from '#shared/domain/catalog/services/trainer-pricing'
import { filterTrainers } from '#shared/domain/catalog/services/filter-trainers'
import { sortTrainers } from '#shared/domain/catalog/services/sort-trainers'
import type { PaginatedTrainersResponse } from '#shared/types/api'
import { getMockAvatarUrl } from '../mocks/mock-photos'
import { loadTrainers, resetTrainerCacheForTests, saveTrainers } from './trainer-repository-storage'
import { mutateTrainer } from './trainer-repository-mutations'

function padTrainerId(index: number): string {
  return `trainer-${String(index + 1).padStart(3, '0')}`
}

function nextTrainerId(trainers: PersonalTrainer[]): string {
  const numericIds = trainers
    .map((trainer) => {
      const match = /^trainer-(\d+)$/.exec(trainer.id)
      return match ? Number(match[1]) : 0
    })
    .filter((value) => value > 0)

  const next = numericIds.length > 0 ? Math.max(...numericIds) + 1 : trainers.length + 1
  return padTrainerId(next - 1)
}

export function findAllTrainers(query: ListQuery): PaginatedTrainersResponse {
  const trainers = loadTrainers()
  const filtered = filterTrainers(trainers, {
    search: query.search,
    specialties: query.specialties,
    modalities: query.modalities,
    onPromotion: query.onPromotion,
    city: query.city,
  })
  const sorted = sortTrainers(filtered, query.sortBy, query.sortOrder)

  const start = (query.page - 1) * query.pageSize
  const items = sorted.slice(start, start + query.pageSize)

  return {
    items,
    total: sorted.length,
    page: query.page,
    pageSize: query.pageSize,
  }
}

export function findTrainerById(id: string): PersonalTrainer | undefined {
  return loadTrainers().find((trainer) => trainer.id === id)
}

export function findTrainersByIds(
  ids: string[],
  page: number,
  pageSize: number,
): PaginatedTrainersResponse {
  const uniqueIds = [...new Set(ids)]
  const trainers = loadTrainers().filter((trainer) => uniqueIds.includes(trainer.id))
  const start = (page - 1) * pageSize
  const items = trainers.slice(start, start + pageSize)

  return {
    items,
    total: trainers.length,
    page,
    pageSize,
  }
}

export function findTrainerByUserId(userId: string): PersonalTrainer | undefined {
  return loadTrainers().find((trainer) => trainer.userId === userId)
}

export function deleteTrainerByUserId(userId: string): void {
  const trainers = loadTrainers()
  const next = trainers.filter((trainer) => trainer.userId !== userId)
  if (next.length !== trainers.length) {
    saveTrainers(next)
  }
}

export function findFeaturedTrainers(limit = 6): PersonalTrainer[] {
  return loadTrainers()
    .filter((trainer) => trainer.featured === true)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit)
}

export function createTrainerForUser(user: AuthUser): PersonalTrainer {
  const trainers = loadTrainers()
  const id = nextTrainerId(trainers)

  const trainer: PersonalTrainer = {
    id,
    userId: user.id,
    name: user.name,
    profession: 'Personal Trainer',
    description: 'Complete seu perfil para aparecer no catálogo com mais detalhes.',
    photoUrl: getMockAvatarUrl(trainers.length),
    servicePrice: 100,
    contactPhone: user.phoneNumber ?? '',
    city: '',
    state: '',
    specialties: [],
    modalities: [],
    cref: '',
    gallery: [],
    availability: '',
    experienceYears: 0,
    reviews: [],
    featured: false,
  }

  const updated = [...trainers, trainer]
  saveTrainers(updated)
  return trainer
}

export function getOrCreateTrainerForUser(user: AuthUser): { trainer: PersonalTrainer, created: boolean } {
  const existing = findTrainerByUserId(user.id)
  if (existing) {
    return { trainer: existing, created: false }
  }

  return { trainer: createTrainerForUser(user), created: true }
}

function buildPromotionFromTemplateActivation(
  payload: TrainerPromotionActivationPayload,
  servicePrice: number,
  existing?: PersonalTrainer['promotion'],
): PersonalTrainer['promotion'] | undefined {
  if (!payload.templateId) {
    return undefined
  }

  const template = findPromotionTemplateById(payload.templateId)
  if (!template || !template.isActive) {
    return undefined
  }

  return hydratePromotionFromTemplate(
    {
      templateId: payload.templateId,
      redemptionCount:
        existing?.templateId === payload.templateId
          ? (existing?.redemptionCount ?? 0)
          : 0,
    },
    template,
    servicePrice,
  )
}

function refreshPromotionPricing(
  current: PersonalTrainer,
  servicePrice: number,
): PersonalTrainer['promotion'] | undefined {
  if (!current.promotion) {
    return undefined
  }

  const percent = current.promotion.discountPercent
    ?? computeDiscountPercent(current.servicePrice, current.promotion.promoPrice)
    ?? 15

  return {
    ...current.promotion,
    discountPercent: percent,
    promoPrice: computePromoPrice(servicePrice, percent),
  }
}

export function updateTrainerInfo(trainerId: string, payload: TrainerInfoPayload): PersonalTrainer {
  return mutateTrainer(trainerId, (current) => ({
    ...current,
    name: payload.name.trim(),
    contactPhone: payload.contactPhone.trim(),
    profession: payload.profession.trim(),
    description: payload.description.trim(),
    specialties: [...payload.specialties],
    modalities: [...payload.modalities],
    city: payload.city.trim(),
    state: payload.state.trim().toUpperCase(),
    servicePrice: payload.servicePrice,
    cref: payload.cref.trim(),
    availability: payload.availability.trim(),
    experienceYears: payload.experienceYears,
    promotion: refreshPromotionPricing(current, payload.servicePrice),
  }))
}

export function updateTrainerPromotion(
  trainerId: string,
  payload: TrainerPromotionActivationPayload,
): PersonalTrainer {
  return mutateTrainer(trainerId, (current) => ({
    ...current,
    promotion: buildPromotionFromTemplateActivation(
      payload,
      current.servicePrice,
      current.promotion,
    ),
  }))
}

export {
  addGalleryImage,
  ensureTrainerUploadDir,
  removeGalleryImage,
  setTrainerCoverPhoto,
  updateTrainerReviewAggregates,
} from './trainer-gallery-repository'

export { resetTrainerCacheForTests }
