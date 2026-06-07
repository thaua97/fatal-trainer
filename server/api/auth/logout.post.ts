import {
  clearSessionCookie,
  destroySession,
  getSessionTokenFromEvent,
} from '../../mocks/mock-user-store'

export default defineEventHandler((event) => {
  const token = getSessionTokenFromEvent(event)
  destroySession(token)
  clearSessionCookie(event)

  return { success: true }
})
