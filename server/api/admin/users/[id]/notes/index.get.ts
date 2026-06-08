import { listUserNotes } from '../../../../../mocks/mock-user-notes-store'
import { findUserById } from '../../../../../mocks/mock-user-store'
import { requireAdminSession } from '../../../../../utils/require-admin-session'

export default defineEventHandler((event) => {
  requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  if (!findUserById(id)) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return listUserNotes(id)
})
