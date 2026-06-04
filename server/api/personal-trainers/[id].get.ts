import { findTrainerById } from '../../services/trainer-repository'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Trainer id is required' })
  }

  const trainer = findTrainerById(id)

  if (!trainer) {
    throw createError({ statusCode: 404, statusMessage: 'Personal trainer not found' })
  }

  return { trainer }
})
