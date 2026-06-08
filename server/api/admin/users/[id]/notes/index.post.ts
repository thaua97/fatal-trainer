import type { CreateAdminUserNoteRequest } from '#shared/types/admin'
import { createUserNote } from '../../../../../mocks/mock-user-notes-store'
import { findUserById } from '../../../../../mocks/mock-user-store'
import { requireAdminSession } from '../../../../../utils/require-admin-session'

export default defineEventHandler(async (event) => {
  const admin = requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  if (!findUserById(id)) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const body = await readBody<CreateAdminUserNoteRequest>(event)
  const content = body.content?.trim()

  if (!content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { message: 'Validation failed', errors: { content: 'required' } },
    })
  }

  const note = createUserNote(id, admin.id, admin.name, content)
  return { note }
})
