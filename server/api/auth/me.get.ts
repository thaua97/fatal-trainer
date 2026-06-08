import {
  getSessionTokenFromEvent,
  getSessionUser,
} from '../../mocks/mock-user-store'
import { enrichAuthUser } from '../../utils/enrich-auth-user'
import { throwUnauthorized } from '../../utils/api-error'

export default defineEventHandler((event) => {
  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (!user) {
    throwUnauthorized()
  }

  return { user: enrichAuthUser(user) }
})
