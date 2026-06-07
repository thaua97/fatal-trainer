import { listRecentImpersonationAccess } from '../../../mocks/mock-admin-store'
import { requireAdminSession } from '../../../utils/require-admin-session'

export default defineEventHandler((event) => {
  requireAdminSession(event)
  const query = getQuery(event)
  const limit = Math.min(20, Math.max(1, Number(query.limit) || 8))
  return { items: listRecentImpersonationAccess(limit) }
})
