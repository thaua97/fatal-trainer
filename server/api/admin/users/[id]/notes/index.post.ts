import { throwNotFound, throwValidationError } from '../../../../../utils/api-error'
import type { CreateAdminUserNoteRequest } from '#shared/types/admin'
import { createUserNote } from '../../../../../mocks/mock-user-notes-store'
import { findUserById } from '../../../../../mocks/mock-user-store'
import { requireAdminSession } from '../../../../../utils/require-admin-session'

export default defineEventHandler(async (event) => {
  const admin = requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throwValidationError({ id: 'required' })
  }

  if (!findUserById(id)) {
    throwNotFound()
  }

  const body = await readBody<CreateAdminUserNoteRequest>(event)
  const content = body.content?.trim()

  if (!content) {
    throwValidationError({ content: 'required' })
  }

  const note = createUserNote(id, admin.id, admin.name, content)
  return { note }
})
