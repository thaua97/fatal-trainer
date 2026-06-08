import { throwForbidden, throwValidationError } from '../../../../utils/api-error'
import { appendActivity } from '../../../../mocks/mock-user-activity-store'
import {
  getAdminUserById,
  toggleUserFeatured,
  getSessionUser,
  getSessionTokenFromEvent,
} from '../../../../mocks/mock-admin-store'

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

  const body = await readBody<{ featured: boolean }>(event)
  const existingDetail = getAdminUserById(id)
  const wasFeatured = existingDetail?.featured ?? false
  const updated = toggleUserFeatured(id, body.featured)

  if (!updated) {
    throwValidationError({ featured: 'cannotToggle' })
  }

  appendActivity({
    userId: id,
    type: 'admin_featured_toggle',
    title: body.featured ? 'Marcado como destaque' : 'Removido do destaque',
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    changes: [
      {
        field: 'featured',
        label: 'Destaque',
        before: wasFeatured ? 'Sim' : 'Não',
        after: body.featured ? 'Sim' : 'Não',
      },
    ],
  })

  return { user: updated }
})
