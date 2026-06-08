import { validateReview } from '#shared/domain/review/services/validate-review'
import type { UpsertReviewRequest } from '#shared/types/api'
import { findMyTrainerReview } from '../../../../mocks/mock-reviews-store'
import { findTrainerById } from '../../../../services/trainer-repository'
import { requireUserSession } from '../../../../utils/require-user-session'

export default defineEventHandler((event) => {
  const trainerId = getRouterParam(event, 'id')
  if (!trainerId) {
    throw createError({ statusCode: 400, statusMessage: 'Trainer id required' })
  }

  const trainer = findTrainerById(trainerId)
  if (!trainer) {
    throw createError({ statusCode: 404, statusMessage: 'Trainer not found' })
  }

  const user = requireUserSession(event)
  const review = findMyTrainerReview(trainerId, user.id)

  return { review }
})
