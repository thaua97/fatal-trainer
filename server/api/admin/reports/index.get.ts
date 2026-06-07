import type { AdminReportsQuery } from '#shared/types/admin'
import { listAdminReports, getSessionUser, getSessionTokenFromEvent } from '../../../mocks/mock-admin-store'

export default defineEventHandler((event) => {
  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (!user || user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const query = getQuery(event) as AdminReportsQuery
  return listAdminReports(query)
})
