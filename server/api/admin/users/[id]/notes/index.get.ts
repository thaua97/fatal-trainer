import { throwNotFound, throwValidationError } from '../../../../../utils/api-error'
import { listUserNotes } from '../../../../../mocks/mock-user-notes-store'
import { findUserById } from '../../../../../mocks/mock-user-store'
import { requireAdminSession } from '../../../../../utils/require-admin-session'

export default defineEventHandler((event) => {
  requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throwValidationError({ id: 'required' })
  }

  if (!findUserById(id)) {
    throwNotFound()
  }

  return listUserNotes(id)
})
