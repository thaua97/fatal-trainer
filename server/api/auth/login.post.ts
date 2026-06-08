import type { LoginRequest } from '#shared/types/api'
import { validateLogin } from '#shared/domain/auth/services/validate-login'
import {
  setSessionCookie,
  findUserByEmail,
  createSession,
} from '../../mocks/mock-user-store'
import { enrichAuthUser } from '../../utils/enrich-auth-user'
import { appendActivity } from '../../mocks/mock-user-activity-store'
import { throwAccountDeactivated, throwInvalidCredentials, throwValidationError } from '../../utils/api-error'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginRequest>(event)

  const validation = validateLogin({
    email: body.email ?? '',
    password: body.password ?? '',
  })

  if (!validation.valid) {
    throwValidationError(validation.errors)
  }

  const user = findUserByEmail(body.email)

  if (!user || user.password !== body.password) {
    throwInvalidCredentials()
  }

  if (!user.isActive) {
    throwAccountDeactivated()
  }

  const token = createSession(user.id)
  setSessionCookie(event, token)

  appendActivity({
    userId: user.id,
    type: 'account_login',
    title: 'Login realizado',
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
  })

  const { password: _password, createdAt: _createdAt, ...authUser } = user
  return { user: enrichAuthUser(authUser) }
})
