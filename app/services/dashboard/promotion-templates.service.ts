import type { PromotionTemplatesResponse } from '#shared/types/api'
import { apiFetch } from '~/services/api/create-api-client'

export async function listPromotionTemplates(): Promise<PromotionTemplatesResponse> {
  return apiFetch('/promotion-templates')
}

export const promotionTemplatesService = {
  listPromotionTemplates,
}
