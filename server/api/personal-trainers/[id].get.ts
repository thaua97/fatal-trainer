import { throwNotFound, throwValidationError } from '../../utils/api-error'
import { findTrainerById } from '../../services/trainer-repository'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throwValidationError({ trainerId: 'required' })
  }

  const trainer = findTrainerById(id)

  if (!trainer) {
    throwNotFound()
  }

  return { trainer }
})
