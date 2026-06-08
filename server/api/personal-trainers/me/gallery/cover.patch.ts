import {
  findTrainerByUserId,
  setTrainerCoverPhoto,
} from '../../../../services/trainer-repository'
import { appendActivity } from '../../../../mocks/mock-user-activity-store'
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

  const body = await readBody<{ url?: string, imageUrl?: string }>(event)
  const url = (body.imageUrl ?? body.url)?.trim()

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { message: 'Validation failed', errors: { url: 'required' } },
    })
  }

  try {
    const updated = setTrainerCoverPhoto(trainer.id, url)

    appendActivity({
      userId: user.id,
      type: 'profile_gallery_edit',
      title: 'Foto de capa alterada',
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      changes: [
        { field: 'photoUrl', label: 'Foto de capa', before: trainer.photoUrl, after: url },
      ],
    })

    return { trainer: updated }
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image not in gallery',
      data: { message: 'Image not in gallery', errors: { url: 'notFound' } },
    })
  }
})
