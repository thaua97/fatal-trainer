import type { UpdateTrainerProfileRequest } from '#shared/types/api'
import type { TrainerInfoPayload, TrainerPromotionActivationPayload } from '#shared/domain/catalog/entities/trainer-profile-payloads'
import {
  validateTrainerInfo,
  validateTrainerPromotionActivation,
} from '#shared/domain/catalog/services/validate-trainer-profile'
import {
  findTrainerByUserId,
  updateTrainerInfo,
  updateTrainerPromotion,
} from '../../services/trainer-repository'
import { updateUserInStore } from '../../mocks/mock-user-store'
import { computeFieldChanges } from '#shared/domain/admin/services/compute-field-changes'
import { appendActivity } from '../../mocks/mock-user-activity-store'
import { requireTrainerSession } from '../../utils/require-trainer-session'
import { findPromotionTemplateById } from '../../mocks/mock-promotion-templates'

const TRAINER_INFO_FIELDS = [
  'name', 'contactPhone', 'profession', 'description', 'specialties',
  'modalities', 'city', 'state', 'servicePrice', 'cref', 'availability', 'experienceYears',
]

const PROMOTION_FIELDS = [
  'templateId', 'discountPercent', 'label', 'startsAt', 'endsAt', 'maxRedemptions', 'promoPrice',
]

export default defineEventHandler(async (event) => {
  const user = requireTrainerSession(event)
  const trainer = findTrainerByUserId(user.id)

  if (!trainer) {
    throwNotFound()
  }

  const body = await readBody<UpdateTrainerProfileRequest>(event)

  if (body.section === 'info') {
    if (!body.info) {
      throwValidationError({ info: 'required' })
    }

    const payload: TrainerInfoPayload = {
      name: body.info.name ?? '',
      contactPhone: body.info.contactPhone ?? '',
      profession: body.info.profession ?? '',
      description: body.info.description ?? '',
      specialties: body.info.specialties ?? [],
      modalities: body.info.modalities ?? [],
      city: body.info.city ?? '',
      state: body.info.state ?? '',
      servicePrice: Number(body.info.servicePrice),
      cref: body.info.cref ?? '',
      availability: body.info.availability ?? '',
      experienceYears: Number(body.info.experienceYears),
    }

    const validation = validateTrainerInfo(payload)
    if (!validation.valid) {
      throwValidationError(validation.errors)
    }

    const beforeRecord: Record<string, unknown> = {
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

    const afterRecord: Record<string, unknown> = {
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

    const changes = computeFieldChanges(beforeRecord, afterRecord, TRAINER_INFO_FIELDS)
    const updated = updateTrainerInfo(trainer.id, payload)
    updateUserInStore(user.id, {
      phoneNumber: payload.contactPhone.trim(),
      name: payload.name.trim(),
      avatarUrl: updated.photoUrl,
      city: payload.city.trim(),
      state: payload.state.trim().toUpperCase(),
    })

    if (changes.length > 0) {
      appendActivity({
        userId: user.id,
        type: 'profile_info_edit',
        title: 'Perfil editado',
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        changes,
      })
    }

    return { trainer: updated }
  }

  if (body.section === 'promotion') {
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

    const promotion = trainer.promotion
    const beforeRecord: Record<string, unknown> = {
      templateId: promotion?.templateId ?? null,
      discountPercent: promotion?.discountPercent ?? 0,
      label: promotion?.label ?? '',
      startsAt: promotion?.startsAt ?? '',
      endsAt: promotion?.endsAt ?? '',
      maxRedemptions: promotion?.maxRedemptions ?? null,
      promoPrice: promotion?.promoPrice ?? trainer.servicePrice,
    }

    const updated = updateTrainerPromotion(trainer.id, payload)

    const afterRecord: Record<string, unknown> = {
      templateId: updated.promotion?.templateId ?? null,
      discountPercent: updated.promotion?.discountPercent ?? 0,
      label: updated.promotion?.label ?? '',
      startsAt: updated.promotion?.startsAt ?? '',
      endsAt: updated.promotion?.endsAt ?? '',
      maxRedemptions: updated.promotion?.maxRedemptions ?? null,
      promoPrice: updated.promotion?.promoPrice ?? trainer.servicePrice,
    }

    const changes = computeFieldChanges(beforeRecord, afterRecord, PROMOTION_FIELDS)
    if (changes.length > 0) {
      appendActivity({
        userId: user.id,
        type: 'profile_promotion_edit',
        title: 'Promoção editada',
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        changes,
      })
    }

    return { trainer: updated }
  }

  throwValidationError({ section: 'invalid' })
})
