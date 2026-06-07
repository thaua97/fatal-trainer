import type { UpdateAdminUserRequest } from '#shared/types/admin'
import {
  updateAdminUser,
  getSessionUser,
  getSessionTokenFromEvent,
} from '../../../mocks/mock-admin-store'

export default defineEventHandler(async (event) => {
  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (!user || user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody<UpdateAdminUserRequest>(event)
  const updated = updateAdminUser(id, body)

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return { user: updated }
})
