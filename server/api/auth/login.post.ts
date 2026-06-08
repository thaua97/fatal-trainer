import type { LoginRequest } from '#shared/types/api'
import { validateLogin } from '#shared/domain/auth/services/validate-login'
import {
  setSessionCookie,
  verifyCredentials,
  createSession,
} from '../../mocks/mock-user-store'
import { enrichAuthUser } from '../../utils/enrich-auth-user'
import { appendActivity } from '../../mocks/mock-user-activity-store'
import { throwInvalidCredentials, throwValidationError } from '../../utils/api-error'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginRequest>(event)

  const validation = validateLogin({
    email: body.email ?? '',
    password: body.password ?? '',
  })

  if (!validation.valid) {
    throwValidationError(validation.errors)
  }

  const user = verifyCredentials(body.email, body.password)

  if (!user) {
    throwInvalidCredentials()
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

  return { user: enrichAuthUser(user) }
})
