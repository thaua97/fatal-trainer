import { getAdminUserById } from '../../../mocks/mock-admin-store'
import { requireAdminSession } from '../../../utils/require-admin-session'

export default defineEventHandler((event) => {
  requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const user = getAdminUserById(id)
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return { user }
})
