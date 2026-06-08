import { throwNotFound, throwValidationError } from '../../../../utils/api-error'
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
    throwNotFound()
  }

  const body = await readBody<{ url?: string, imageUrl?: string }>(event)
  const url = (body.imageUrl ?? body.url)?.trim()

  if (!url) {
    throwValidationError({ url: 'required' })
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
    throwValidationError({ url: 'notFound' })
  }
})
