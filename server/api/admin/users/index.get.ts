import { throwForbidden } from '../../../utils/api-error'
import type { AdminUsersQuery } from '#shared/types/admin'
import { listAdminUsers, getSessionUser, getSessionTokenFromEvent } from '../../../mocks/mock-admin-store'

export default defineEventHandler((event) => {
  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (!user || user.role !== 'admin') {
    throwForbidden()
  }

  const query = getQuery(event) as AdminUsersQuery
  return listAdminUsers(query)
})
