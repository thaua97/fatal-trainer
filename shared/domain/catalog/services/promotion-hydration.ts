import type { TrainerPromotion } from '../entities/personal-trainer'
import { computePromoPrice } from './trainer-pricing'

export interface PromotionTemplateRecord {
  id: string
  name: string
  label: string
  discountPercent: number
  startsAt: string
  endsAt: string
  maxRedemptions?: number
  isActive: boolean
}

export interface TrainerPromotionRef {
  templateId: string
  redemptionCount?: number
}

export function isPromotionRef(value: unknown): value is TrainerPromotionRef {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return typeof record.templateId === 'string'
}

export function hydratePromotionFromTemplate(
  ref: TrainerPromotionRef,
  template: PromotionTemplateRecord,
  servicePrice: number,
): TrainerPromotion | undefined {
  if (!template.isActive) return undefined

  return {
    templateId: template.id,
    discountPercent: template.discountPercent,
    promoPrice: computePromoPrice(servicePrice, template.discountPercent),
    label: template.label,
    startsAt: template.startsAt,
    endsAt: template.endsAt,
    maxRedemptions: template.maxRedemptions,
    redemptionCount: ref.redemptionCount ?? 0,
  }
}
