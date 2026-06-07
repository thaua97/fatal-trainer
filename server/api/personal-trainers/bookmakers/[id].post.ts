import { addBookmaker } from '../../../mocks/mock-bookmakers-store'
import { findTrainerById } from '../../../services/trainer-repository'
import { requireUserSession } from '../../../utils/require-user-session'

export default defineEventHandler((event) => {
  const user = requireUserSession(event)
  const trainerId = getRouterParam(event, 'id')

  if (!trainerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Trainer id is required',
    })
  }

  const trainer = findTrainerById(trainerId)

  if (!trainer) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Trainer not found',
    })
  }

  addBookmaker(user.id, trainerId)

  return { ok: true }
})
