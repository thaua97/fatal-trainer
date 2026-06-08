import { throwNotFound, throwValidationError } from '../../../utils/api-error'
import { getAdminUserById } from '../../../mocks/mock-admin-store'
import { requireAdminSession } from '../../../utils/require-admin-session'

export default defineEventHandler((event) => {
  requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throwValidationError({ id: 'required' })
  }

  const user = getAdminUserById(id)
  if (!user) {
    throwNotFound()
  }

  return { user }
})
