import type { PromotionTemplateStatus } from '#shared/types/admin'

export interface PromotionStatusMeta {
  status: PromotionTemplateStatus | 'disabled'
  label: string
  color: 'success' | 'warning' | 'neutral' | 'error'
}

export function getPromotionTemplateStatus(
  item: {
    isActive: boolean
    startsAt: string
    endsAt: string
  },
  referenceDate = new Date().toISOString().slice(0, 10),
): PromotionStatusMeta {
  if (!item.isActive) {
    return { status: 'disabled', label: 'Desativada', color: 'neutral' }
  }

  if (item.endsAt < referenceDate) {
    return { status: 'expired', label: 'Expirada', color: 'neutral' }
  }

  if (item.startsAt > referenceDate) {
    return { status: 'upcoming', label: 'Agendada', color: 'warning' }
  }

  return { status: 'active', label: 'Ativa', color: 'success' }
}

export function formatPromotionPeriod(startsAt: string, endsAt: string): string {
  const format = (value: string) => {
    const [year, month, day] = value.split('-')
    return `${day}/${month}/${year}`
  }

  return `${format(startsAt)} – ${format(endsAt)}`
}
