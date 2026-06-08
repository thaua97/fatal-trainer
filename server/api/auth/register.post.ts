import type { RegisterRequest } from '#shared/types/api'
import { validateRegister } from '#shared/domain/auth/services/validate-register'
import {
  createSession,
  createUser,
  findUserByEmail,
  setSessionCookie,
} from '../../mocks/mock-user-store'
import { enrichAuthUser } from '../../utils/enrich-auth-user'
import { appendActivity } from '../../mocks/mock-user-activity-store'

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterRequest>(event)

  const validation = validateRegister({
    name: body.name ?? '',
    email: body.email ?? '',
    password: body.password ?? '',
    confirmPassword: body.confirmPassword ?? '',
    role: body.role ?? '',
    termsAccepted: Boolean(body.termsAccepted),
  })

  if (!validation.valid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: {
        message: 'Validation failed',
        errors: validation.errors,
      },
    })
  }

  if (findUserByEmail(body.email)) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Email already registered',
      data: {
        message: 'Email already registered',
        errors: {
          email: 'alreadyRegistered',
        },
      },
    })
  }

  const user = createUser({
    name: body.name,
    email: body.email,
    password: body.password,
    role: body.role,
  })

  const token = createSession(user.id)
  setSessionCookie(event, token)

  appendActivity({
    userId: user.id,
    type: 'account_register',
    title: 'Conta criada',
    description: 'Cadastro realizado na plataforma',
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
  })

  setResponseStatus(event, 201)
  return { user: enrichAuthUser(user) }
})
