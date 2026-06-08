import { createPromotionTemplate } from '../../../mocks/mock-promotion-templates'
import { requireAdminSession } from '../../../utils/require-admin-session'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const body = await readBody(event)

  const promotion = createPromotionTemplate({
    name: body.name,
    label: body.label,
    discountPercent: Number(body.discountPercent),
    startsAt: body.startsAt,
    endsAt: body.endsAt,
    maxRedemptions: body.maxRedemptions ?? undefined,
    isActive: body.isActive ?? true,
  })

  return {
    promotion: {
      ...promotion,
      activationCount: 0,
      createdAt: new Date().toISOString(),
    },
  }
})
