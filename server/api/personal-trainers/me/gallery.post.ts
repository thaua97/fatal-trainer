import { randomUUID } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  addGalleryImage,
  ensureTrainerUploadDir,
  findTrainerByUserId,
} from '../../../services/trainer-repository'
import { appendActivity } from '../../../mocks/mock-user-activity-store'
import { requireTrainerSession } from '../../../utils/require-trainer-session'

const MAX_GALLERY_IMAGES = 12
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function extensionForMime(mime: string): string {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  return 'jpg'
}

export default defineEventHandler(async (event) => {
  const user = requireTrainerSession(event)
  const trainer = findTrainerByUserId(user.id)

  if (!trainer) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Trainer profile not found',
    })
  }

  const gallery = trainer.gallery ?? []
  if (gallery.length >= MAX_GALLERY_IMAGES) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Gallery limit reached',
      data: { message: 'Gallery limit reached', errors: { gallery: 'limit' } },
    })
  }

  const formData = await readMultipartFormData(event)
  const filePart = formData?.find((part) => part.name === 'file' && part.data)

  if (!filePart?.data || !filePart.type) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { message: 'Validation failed', errors: { file: 'required' } },
    })
  }

  if (!ALLOWED_TYPES.has(filePart.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { message: 'Validation failed', errors: { file: 'invalidType' } },
    })
  }

  if (filePart.data.length > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { message: 'Validation failed', errors: { file: 'tooLarge' } },
    })
  }

  const uploadDir = ensureTrainerUploadDir(trainer.id)
  const ext = extensionForMime(filePart.type)
  const filename = `${randomUUID()}.${ext}`
  const absolutePath = join(uploadDir, filename)
  writeFileSync(absolutePath, filePart.data)

  const url = `/uploads/trainers/${trainer.id}/${filename}`
  const updated = addGalleryImage(trainer.id, url)

  appendActivity({
    userId: user.id,
    type: 'profile_gallery_edit',
    title: 'Imagem adicionada à galeria',
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    metadata: { action: 'add', url },
  })

  return {
    url,
    gallery: updated.gallery ?? [],
  }
})
