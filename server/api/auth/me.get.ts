import {
  getSessionTokenFromEvent,
  getSessionUser,
} from '../../mocks/mock-user-store'
import { enrichAuthUser } from '../../utils/enrich-auth-user'

export default defineEventHandler((event) => {
  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return { user: enrichAuthUser(user) }
})
