import {
  impersonateUser,
  getSessionUser,
  getSessionTokenFromEvent,
} from '../../../../mocks/mock-admin-store'

export default defineEventHandler((event) => {
  const token = getSessionTokenFromEvent(event)
  const admin = getSessionUser(token)

  if (!admin || admin.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const user = impersonateUser(event, token!, id)

  if (!user) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot impersonate user' })
  }

  return { user }
})
