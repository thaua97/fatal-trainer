import type { LoginRequest } from '#shared/types/api'
import { validateLogin } from '#shared/domain/auth/services/validate-login'
import {
  adminLogin,
  setSessionCookie,
} from '../../../mocks/mock-admin-store'
import { createSession } from '../../../mocks/mock-user-store'
import { throwInvalidCredentials, throwValidationError } from '../../../utils/api-error'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginRequest>(event)

  const validation = validateLogin({
    email: body.email ?? '',
    password: body.password ?? '',
  })

  if (!validation.valid) {
    throwValidationError(validation.errors)
  }

  const user = adminLogin(body.email, body.password)

  if (!user) {
    throwInvalidCredentials()
  }

  const token = createSession(user.id)
  setSessionCookie(event, token)

  return { user }
})
