import { throwNotFound, throwValidationError } from '../../../../utils/api-error'
import { validateReview } from '#shared/domain/review/services/validate-review'
import type { UpsertReviewRequest } from '#shared/types/api'
import { findMyTrainerReview } from '../../../../mocks/mock-reviews-store'
import { findTrainerById } from '../../../../services/trainer-repository'
import { requireUserSession } from '../../../../utils/require-user-session'

export default defineEventHandler((event) => {
  const trainerId = getRouterParam(event, 'id')
  if (!trainerId) {
    throwValidationError({ trainerId: 'required' })
  }

  const trainer = findTrainerById(trainerId)
  if (!trainer) {
    throwNotFound()
  }

  const user = requireUserSession(event)
  const review = findMyTrainerReview(trainerId, user.id)

  return { review }
})
