import type { PromotionTemplateListItem } from '#shared/types/admin'

const DEFAULT_TEMPLATES: PromotionTemplateListItem[] = [
  {
    id: 'promo-primeira-sessao',
    name: 'Primeira sessão',
    label: 'Primeira sessão',
    discountPercent: 20,
    startsAt: '2026-01-01',
    endsAt: '2026-12-31',
    maxRedemptions: 50,
    isActive: true,
  },
  {
    id: 'promo-pacote-mensal',
    name: 'Pacote mensal',
    label: 'Pacote mensal',
    discountPercent: 15,
    startsAt: '2026-01-01',
    endsAt: '2026-12-31',
    isActive: true,
  },
  {
    id: 'promo-lancamento',
    name: 'Oferta de lançamento',
    label: 'Oferta de lançamento',
    discountPercent: 30,
    startsAt: '2026-01-01',
    endsAt: '2026-12-31',
    maxRedemptions: 20,
    isActive: true,
  },
]

let templates = [...DEFAULT_TEMPLATES]

export function listPromotionTemplates(referenceDate = new Date().toISOString().slice(0, 10)) {
  return templates.filter(
    template => template.isActive && template.endsAt >= referenceDate,
  )
}

export function listAllPromotionTemplates() {
  return templates
}

export function findPromotionTemplateById(id: string) {
  return templates.find(template => template.id === id) ?? null
}

export function createPromotionTemplate(
  payload: Omit<PromotionTemplateListItem, 'id'>,
): PromotionTemplateListItem {
  const created = {
    ...payload,
    id: crypto.randomUUID(),
  }
  templates = [created, ...templates]
  return created
}

export function updatePromotionTemplate(
  id: string,
  payload: Partial<PromotionTemplateListItem>,
): PromotionTemplateListItem | null {
  const index = templates.findIndex(template => template.id === id)
  if (index === -1) return null

  templates[index] = {
    ...templates[index]!,
    ...payload,
  }

  return templates[index]!
}

export function deletePromotionTemplate(id: string): boolean {
  const before = templates.length
  templates = templates.filter(template => template.id !== id)
  return templates.length < before
}

export function resetPromotionTemplates() {
  templates = [...DEFAULT_TEMPLATES]
}
