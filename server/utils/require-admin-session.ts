import type { H3Event } from 'h3'
import type { AuthUser } from '#shared/domain/auth/entities/user'
import {
  getSessionTokenFromEvent,
  getSessionUser,
} from '../mocks/mock-admin-store'

export function requireAdminSession(event: H3Event): AuthUser {
  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (!user || user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  return user
}
