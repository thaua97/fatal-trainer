import {
  findTrainerByUserId,
  removeGalleryImage,
} from '../../../../services/trainer-repository'
import { requireTrainerSession } from '../../../../utils/require-trainer-session'

export default defineEventHandler(async (event) => {
  const user = requireTrainerSession(event)
  const trainer = findTrainerByUserId(user.id)

  if (!trainer) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Trainer profile not found',
    })
  }

  const indexParam = getRouterParam(event, 'index')
  const imageIndex = Number(indexParam)

  if (!Number.isInteger(imageIndex) || imageIndex < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { message: 'Validation failed', errors: { index: 'invalid' } },
    })
  }

  try {
    const updated = removeGalleryImage(trainer.id, imageIndex)
    return { trainer: updated }
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Image not found',
    })
  }
})
