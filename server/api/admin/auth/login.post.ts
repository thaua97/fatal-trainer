import type { LoginRequest } from '#shared/types/api'
import { validateLogin } from '#shared/domain/auth/services/validate-login'
import {
  adminLogin,
  setSessionCookie,
} from '../../../mocks/mock-admin-store'
import { createSession } from '../../../mocks/mock-user-store'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginRequest>(event)

  const validation = validateLogin({
    email: body.email ?? '',
    password: body.password ?? '',
  })

  if (!validation.valid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { message: 'Validation failed', errors: validation.errors },
    })
  }

  const user = adminLogin(body.email, body.password)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
      data: { message: 'Invalid credentials' },
    })
  }

  const token = createSession(user.id)
  setSessionCookie(event, token)

  return { user }
})
