import { validateReview } from '#shared/domain/review/services/validate-review'
import type { UpsertReviewRequest } from '#shared/types/api'
import { upsertTrainerReview } from '../../../mocks/mock-reviews-store'
import { findTrainerById } from '../../../services/trainer-repository'
import { requireUserSession } from '../../../utils/require-user-session'

export default defineEventHandler(async (event) => {
  const trainerId = getRouterParam(event, 'id')
  if (!trainerId) {
    throw createError({ statusCode: 400, statusMessage: 'Trainer id required' })
  }

  const trainer = findTrainerById(trainerId)
  if (!trainer) {
    throw createError({ statusCode: 404, statusMessage: 'Trainer not found' })
  }

  const user = requireUserSession(event)

  if (trainer.userId === user.id) {
    throw createError({ statusCode: 403, statusMessage: 'You cannot review your own profile' })
  }

  const body = await readBody<UpsertReviewRequest>(event)
  const validation = validateReview(body)

  if (!validation.valid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: {
        message: 'Validation failed',
        errors: validation.errors,
      },
    })
  }

  const result = upsertTrainerReview(trainerId, user.id, user.name, {
    rating: body.rating,
    comment: body.comment.trim(),
  })

  setResponseStatus(event, result.created ? 201 : 200)
  return result
})
