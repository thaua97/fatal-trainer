import { throwNotFound } from '../../../utils/api-error'
import { updatePromotionTemplate } from '../../../mocks/mock-promotion-templates'
import { requireAdminSession } from '../../../utils/require-admin-session'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const promotion = updatePromotionTemplate(id, {
    ...(body.name !== undefined ? { name: body.name } : {}),
    ...(body.label !== undefined ? { label: body.label } : {}),
    ...(body.discountPercent !== undefined ? { discountPercent: Number(body.discountPercent) } : {}),
    ...(body.startsAt !== undefined ? { startsAt: body.startsAt } : {}),
    ...(body.endsAt !== undefined ? { endsAt: body.endsAt } : {}),
    ...(body.maxRedemptions !== undefined ? { maxRedemptions: body.maxRedemptions ?? undefined } : {}),
    ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
  })

  if (!promotion) {
    throwNotFound()
  }

  return {
    promotion: {
      ...promotion,
      activationCount: 0,
      createdAt: new Date().toISOString(),
    },
  }
})
