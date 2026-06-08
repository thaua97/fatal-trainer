import { throwNotFound } from '../../../utils/api-error'
import { deletePromotionTemplate } from '../../../mocks/mock-promotion-templates'
import { requireAdminSession } from '../../../utils/require-admin-session'

export default defineEventHandler((event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')!

  const deleted = deletePromotionTemplate(id)
  if (!deleted) {
    throwNotFound()
  }

  setResponseStatus(event, 204)
  return null
})
