import type { H3Event } from 'h3'
import type { AuthUser } from '#shared/domain/auth/entities/user'
import {
  getSessionTokenFromEvent,
  getSessionUser,
} from '../mocks/mock-user-store'

export function requireUserSession(event: H3Event): AuthUser {
  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return user
}
