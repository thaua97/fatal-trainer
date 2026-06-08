import { throwForbidden, throwNotFound, throwValidationError } from '../../../utils/api-error'
import { validateReview } from '#shared/domain/review/services/validate-review'
import type { UpsertReviewRequest } from '#shared/types/api'
import { upsertTrainerReview } from '../../../mocks/mock-reviews-store'
import { findTrainerById } from '../../../services/trainer-repository'
import { requireUserSession } from '../../../utils/require-user-session'

export default defineEventHandler(async (event) => {
  const trainerId = getRouterParam(event, 'id')
  if (!trainerId) {
    throwValidationError({ trainerId: 'required' })
  }

  const trainer = findTrainerById(trainerId)
  if (!trainer) {
    throwNotFound()
  }

  const user = requireUserSession(event)

  if (trainer.userId === user.id) {
    throwForbidden()
  }

  const body = await readBody<UpsertReviewRequest>(event)
  const validation = validateReview(body)

  if (!validation.valid) {
    throwValidationError(validation.errors)
  }

  const result = upsertTrainerReview(trainerId, user.id, user.name, {
    rating: body.rating,
    comment: body.comment.trim(),
  })

  setResponseStatus(event, result.created ? 201 : 200)
  return result
})
