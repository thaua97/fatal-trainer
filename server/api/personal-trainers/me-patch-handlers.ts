import type { AuthUser } from '#shared/domain/auth/entities/user'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type {
  TrainerInfoPayload,
  TrainerPromotionActivationPayload,
} from '#shared/domain/catalog/entities/trainer-profile-payloads'
import type { UpdateTrainerProfileRequest } from '#shared/types/api'
import { computeFieldChanges } from '#shared/domain/admin/services/compute-field-changes'
import {
  validateTrainerInfo,
  validateTrainerPromotionActivation,
} from '#shared/domain/catalog/services/validate-trainer-profile'
import { appendActivity } from '../../mocks/mock-user-activity-store'
import { findPromotionTemplateById } from '../../mocks/mock-promotion-templates'
import { updateUserInStore } from '../../mocks/mock-user-store'
import {
  updateTrainerInfo,
  updateTrainerPromotion,
} from '../../services/trainer-repository'

const TRAINER_INFO_FIELDS = [
  'name', 'contactPhone', 'profession', 'description', 'specialties',
  'modalities', 'city', 'state', 'servicePrice', 'cref', 'availability', 'experienceYears',
]

const PROMOTION_FIELDS = [
  'templateId', 'discountPercent', 'label', 'startsAt', 'endsAt', 'maxRedemptions', 'promoPrice',
]

function buildTrainerInfoPayload(info: NonNullable<UpdateTrainerProfileRequest['info']>): TrainerInfoPayload {
  return {
    name: info.name ?? '',
    contactPhone: info.contactPhone ?? '',
    profession: info.profession ?? '',
    description: info.description ?? '',
    specialties: info.specialties ?? [],
    modalities: info.modalities ?? [],
    city: info.city ?? '',
    state: info.state ?? '',
    servicePrice: Number(info.servicePrice),
    cref: info.cref ?? '',
    availability: info.availability ?? '',
    experienceYears: Number(info.experienceYears),
  }
}

function buildTrainerInfoRecord(
  trainer: PersonalTrainer,
  payload?: TrainerInfoPayload,
): Record<string, unknown> {
  const base = {
    name: trainer.name,
    contactPhone: trainer.contactPhone ?? '',
    profession: trainer.profession,
    description: trainer.description,
    specialties: trainer.specialties ?? [],
    modalities: trainer.modalities ?? [],
    city: trainer.city ?? '',
    state: trainer.state ?? '',
    servicePrice: trainer.servicePrice,
    cref: trainer.cref ?? '',
    availability: trainer.availability ?? '',
    experienceYears: trainer.experienceYears ?? 0,
  }

  if (!payload) {
    return base
  }

  return {
    ...base,
    name: payload.name.trim(),
    contactPhone: payload.contactPhone.trim(),
    profession: payload.profession.trim(),
    description: payload.description.trim(),
    specialties: payload.specialties,
    modalities: payload.modalities,
    city: payload.city.trim(),
    state: payload.state.trim().toUpperCase(),
    servicePrice: payload.servicePrice,
    cref: payload.cref.trim(),
    availability: payload.availability.trim(),
    experienceYears: payload.experienceYears,
  }
}

function promotionSnapshot(
  trainer: PersonalTrainer,
  promotion?: PersonalTrainer['promotion'],
) {
  const {
    templateId = null,
    discountPercent = 0,
    label = '',
    startsAt = '',
    endsAt = '',
    maxRedemptions = null,
    promoPrice = trainer.servicePrice,
  } = promotion ?? trainer.promotion ?? {}

  return {
    templateId,
    discountPercent,
    label,
    startsAt,
    endsAt,
    maxRedemptions,
    promoPrice,
  }
}

function appendProfileActivity(
  user: AuthUser,
  type: 'profile_info_edit' | 'profile_promotion_edit',
  title: string,
  changes: ReturnType<typeof computeFieldChanges>,
): void {
  if (changes.length === 0) {
    return
  }

  appendActivity({
    userId: user.id,
    type,
    title,
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    changes,
  })
}

export function handleTrainerInfoUpdate(
  user: AuthUser,
  trainer: PersonalTrainer,
  body: UpdateTrainerProfileRequest,
) {
  if (!body.info) {
    throwValidationError({ info: 'required' })
  }

  const payload = buildTrainerInfoPayload(body.info)
  const validation = validateTrainerInfo(payload)
  if (!validation.valid) {
    throwValidationError(validation.errors)
  }

  const beforeRecord = buildTrainerInfoRecord(trainer)
  const afterRecord = buildTrainerInfoRecord(trainer, payload)
  const changes = computeFieldChanges(beforeRecord, afterRecord, TRAINER_INFO_FIELDS)
  const updated = updateTrainerInfo(trainer.id, payload)

  updateUserInStore(user.id, {
    phoneNumber: payload.contactPhone.trim(),
    name: payload.name.trim(),
    avatarUrl: updated.photoUrl,
    city: payload.city.trim(),
    state: payload.state.trim().toUpperCase(),
  })

  appendProfileActivity(user, 'profile_info_edit', 'Perfil editado', changes)

  return { trainer: updated }
}

export function handleTrainerPromotionUpdate(
  user: AuthUser,
  trainer: PersonalTrainer,
  body: UpdateTrainerProfileRequest,
) {
  if (!body.promotion) {
    throwValidationError({ promotion: 'required' })
  }

  const payload: TrainerPromotionActivationPayload = {
    templateId: body.promotion.templateId ?? null,
  }

  const validation = validateTrainerPromotionActivation(payload, trainer.servicePrice)
  if (!validation.valid) {
    throwValidationError(validation.errors)
  }

  if (payload.templateId) {
    const template = findPromotionTemplateById(payload.templateId)
    if (!template || !template.isActive) {
      throwNotFound()
    }

    const today = new Date().toISOString().slice(0, 10)
    if (template.endsAt < today) {
      throwValidationError({ templateId: 'expired' })
    }
  }

  const beforeRecord = promotionSnapshot(trainer)
  const updated = updateTrainerPromotion(trainer.id, payload)
  const afterRecord = promotionSnapshot(trainer, updated.promotion)
  const changes = computeFieldChanges(beforeRecord, afterRecord, PROMOTION_FIELDS)

  appendProfileActivity(user, 'profile_promotion_edit', 'Promoção editada', changes)

  return { trainer: updated }
}
