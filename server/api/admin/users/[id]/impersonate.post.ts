import { throwForbidden, throwValidationError } from '../../../../utils/api-error'
import {
  impersonateUser,
  getSessionUser,
  getSessionTokenFromEvent,
} from '../../../../mocks/mock-admin-store'

export default defineEventHandler((event) => {
  const token = getSessionTokenFromEvent(event)
  const admin = getSessionUser(token)

  if (!admin || admin.role !== 'admin') {
    throwForbidden()
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throwValidationError({ id: 'required' })
  }

  if (admin.id === id) {
    throwForbidden()
  }

  const user = impersonateUser(event, token!, id)

  if (!user) {
    throwValidationError({ user: 'cannotImpersonate' })
  }

  return { user }
})
