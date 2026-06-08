import { throwNotFound, throwValidationError } from '../../../../utils/api-error'
import { deactivateTrainerFromReport } from '../../../../mocks/mock-admin-store'
import { requireAdminSession } from '../../../../utils/require-admin-session'

export default defineEventHandler((event) => {
  const admin = requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throwValidationError({ id: 'required' })
  }

  const report = deactivateTrainerFromReport(id, admin.id)

  if (!report) {
    throwNotFound()
  }

  return { report }
})
