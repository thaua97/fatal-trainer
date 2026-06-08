import { listAllPromotionTemplates } from '../../../mocks/mock-promotion-templates'
import { requireAdminSession } from '../../../utils/require-admin-session'

export default defineEventHandler((event) => {
  requireAdminSession(event)

  const query = getQuery(event)
  const page = Number(query.page ?? 1)
  const pageSize = Number(query.pageSize ?? 10)
  const search = String(query.search ?? '').trim().toLowerCase()

  let items = listAllPromotionTemplates().map(template => ({
    ...template,
    activationCount: 0,
    createdAt: new Date().toISOString(),
  }))

  if (search) {
    items = items.filter(item =>
      item.name.toLowerCase().includes(search)
      || item.label.toLowerCase().includes(search),
    )
  }

  const total = items.length
  const start = (page - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  }
})
