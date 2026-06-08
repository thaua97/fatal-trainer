import { describe, expect, it } from 'vitest'
import { getPromotionTemplateStatus } from '#shared/utils/promotion-template-status'

describe('getPromotionTemplateStatus', () => {
  it('returns active for current templates', () => {
    const result = getPromotionTemplateStatus({
      isActive: true,
      startsAt: '2026-01-01',
      endsAt: '2026-12-31',
    }, '2026-06-08')

    expect(result.status).toBe('active')
    expect(result.label).toBe('Ativa')
  })

  it('returns disabled when admin disabled template', () => {
    const result = getPromotionTemplateStatus({
      isActive: false,
      startsAt: '2026-01-01',
      endsAt: '2026-12-31',
    })

    expect(result.status).toBe('disabled')
  })
})
