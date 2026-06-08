import { throwNotFound, throwValidationError } from '../../../utils/api-error'
import { addBookmaker } from '../../../mocks/mock-bookmakers-store'
import { findTrainerById } from '../../../services/trainer-repository'
import { requireUserSession } from '../../../utils/require-user-session'

export default defineEventHandler((event) => {
  const user = requireUserSession(event)
  const trainerId = getRouterParam(event, 'id')

  if (!trainerId) {
    throwValidationError({ trainerId: 'required' })
  }

  const trainer = findTrainerById(trainerId)

  if (!trainer) {
    throwNotFound()
  }

  addBookmaker(user.id, trainerId)

  return { ok: true }
})
