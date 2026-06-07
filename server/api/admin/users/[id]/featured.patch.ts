import {
  toggleUserFeatured,
  getSessionUser,
  getSessionTokenFromEvent,
} from '../../../../mocks/mock-admin-store'

export default defineEventHandler(async (event) => {
  const token = getSessionTokenFromEvent(event)
  const user = getSessionUser(token)

  if (!user || user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody<{ featured: boolean }>(event)
  const updated = toggleUserFeatured(id, body.featured)

  if (!updated) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot toggle featured' })
  }

  return { user: updated }
})
