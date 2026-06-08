import type { H3Event } from 'h3'
import type { AuthUser } from '#shared/domain/auth/entities/user'
import {
  getSessionTokenFromEvent,
  getSessionUser,
} from '../mocks/mock-user-store'
import { throwForbidden, throwUnauthorized } from './api-error'

export function requireTrainerSession(event: H3Event): AuthUser {
  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (!user) {
    throwUnauthorized()
  }

  if (user.role !== 'personal-trainer') {
    throwForbidden()
  }

  return user
}
