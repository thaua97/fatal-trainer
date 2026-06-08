import type { AdminReportsQuery } from '#shared/types/admin'
import { listAdminReports } from '../../../mocks/mock-admin-store'
import { requireAdminSession } from '../../../utils/require-admin-session'

export default defineEventHandler((event) => {
  requireAdminSession(event)

  const query = getQuery(event) as AdminReportsQuery
  return listAdminReports(query)
})
