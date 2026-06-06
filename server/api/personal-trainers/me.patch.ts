import type { UpdateTrainerProfileRequest } from '#shared/types/api'
import type { TrainerInfoPayload, TrainerPromotionPayload } from '#shared/domain/catalog/entities/trainer-profile-payloads'
import { validateTrainerInfo, validateTrainerPromotion } from '#shared/domain/catalog/services/validate-trainer-profile'
import {
  findTrainerByUserId,
  updateTrainerInfo,
  updateTrainerPromotion,
} from '../../services/trainer-repository'
import { requireTrainerSession } from '../../utils/require-trainer-session'

export default defineEventHandler(async (event) => {
  const user = requireTrainerSession(event)
  const trainer = findTrainerByUserId(user.id)

  if (!trainer) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Trainer profile not found',
    })
  }

  const body = await readBody<UpdateTrainerProfileRequest>(event)

  if (body.section === 'info') {
    if (!body.info) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: { message: 'Validation failed', errors: { info: 'required' } },
      })
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
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: { message: 'Validation failed', errors: validation.errors },
      })
    }

    const updated = updateTrainerInfo(trainer.id, payload)
    return { trainer: updated }
  }

  if (body.section === 'promotion') {
    if (!body.promotion) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: { message: 'Validation failed', errors: { promotion: 'required' } },
      })
    }

    const payload: TrainerPromotionPayload = {
      active: Boolean(body.promotion.active),
      discountPercent: Number(body.promotion.discountPercent),
      label: body.promotion.label ?? '',
      startsAt: body.promotion.startsAt ?? '',
      endsAt: body.promotion.endsAt ?? '',
      maxRedemptions: body.promotion.maxRedemptions ?? null,
    }

    const validation = validateTrainerPromotion(payload, trainer.servicePrice)
    if (!validation.valid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: { message: 'Validation failed', errors: validation.errors },
      })
    }

    const updated = updateTrainerPromotion(trainer.id, payload)
    return { trainer: updated }
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Validation failed',
    data: { message: 'Validation failed', errors: { section: 'invalid' } },
  })
})
