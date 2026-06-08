import { throwNotFound, throwValidationError } from '../../../utils/api-error'
import type { ReportStatus } from '#shared/types/admin'
import { updateReportStatus } from '../../../mocks/mock-admin-store'
import { requireAdminSession } from '../../../utils/require-admin-session'

export default defineEventHandler(async (event) => {
  const admin = requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throwValidationError({ id: 'required' })
  }

  const body = await readBody<{ status: ReportStatus }>(event)
  const report = updateReportStatus(id, body.status, admin.id)

  if (!report) {
    throwNotFound()
  }

  return { report }
})
