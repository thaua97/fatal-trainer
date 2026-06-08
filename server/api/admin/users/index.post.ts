import { throwForbidden } from '../../../utils/api-error'
import type { CreateAdminUserRequest } from '#shared/types/admin'
import {
  createAdminUser,
  getSessionUser,
  getSessionTokenFromEvent,
} from '../../../mocks/mock-admin-store'

export default defineEventHandler(async (event) => {
  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (!user || user.role !== 'admin') {
    throwForbidden()
  }

  const body = await readBody<CreateAdminUserRequest>(event)
  const created = createAdminUser(body)
  return { user: created }
})
