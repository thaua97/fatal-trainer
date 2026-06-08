import { throwForbidden, throwNotFound, throwValidationError } from '../../../utils/api-error'
import { deleteAdminUser, getSessionTokenFromEvent, getSessionUser } from '../../../mocks/mock-admin-store'

export default defineEventHandler(async (event) => {
  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (!user || user.role !== 'admin') {
    throwForbidden()
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throwValidationError({ id: 'required' })
  }

  if (user.id === id) {
    throwValidationError({ user: 'cannotDeleteSelf' })
  }

  const deleted = deleteAdminUser(user.id, id)
  if (!deleted) {
    throwNotFound()
  }

  setResponseStatus(event, 204)
})
