import { exitImpersonation } from '../../../mocks/mock-admin-store'

export default defineEventHandler((event) => {
  const success = exitImpersonation(event)
  if (!success) {
    throw createError({ statusCode: 400, statusMessage: 'Not impersonating' })
  }
  return { success: true }
})
