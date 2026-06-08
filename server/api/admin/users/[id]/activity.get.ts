import type { AdminUserActivityQuery } from '#shared/types/admin'
import { listUserActivity } from '../../../../mocks/mock-user-activity-store'
import { findUserById } from '../../../../mocks/mock-user-store'
import { requireAdminSession } from '../../../../utils/require-admin-session'

export default defineEventHandler((event) => {
  requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  if (!findUserById(id)) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const query = getQuery(event) as AdminUserActivityQuery
  const page = Number(query.page) || 1
  const pageSize = Number(query.pageSize) || 10

  return listUserActivity(id, page, pageSize)
})
