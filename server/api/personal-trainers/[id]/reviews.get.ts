import { findTrainerById } from '../../../services/trainer-repository'
import { listTrainerReviews } from '../../../mocks/mock-reviews-store'

export default defineEventHandler((event) => {
  const trainerId = getRouterParam(event, 'id')
  if (!trainerId) {
    throw createError({ statusCode: 400, statusMessage: 'Trainer id required' })
  }

  const trainer = findTrainerById(trainerId)
  if (!trainer) {
    throw createError({ statusCode: 404, statusMessage: 'Trainer not found' })
  }

  const query = getQuery(event)
  const page = Number(query.page) > 0 ? Number(query.page) : 1
  const pageSize = Number(query.pageSize) > 0 ? Number(query.pageSize) : 10

  return listTrainerReviews(trainerId, page, pageSize)
})
