import type { ReportStatus } from '#shared/types/admin'
import {
  updateReportStatus,
  getSessionUser,
  getSessionTokenFromEvent,
} from '../../../mocks/mock-admin-store'

export default defineEventHandler(async (event) => {
  const token = getSessionTokenFromEvent(event)
  const admin = getSessionUser(token)

  if (!admin || admin.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody<{ status: ReportStatus }>(event)
  const report = updateReportStatus(id, body.status, admin.id)

  if (!report) {
    throw createError({ statusCode: 404, statusMessage: 'Report not found' })
  }

  return { report }
})
