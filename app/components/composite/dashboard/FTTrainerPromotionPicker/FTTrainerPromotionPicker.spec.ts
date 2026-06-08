import { describe, expect, it, vi } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import FTTrainerPromotionPicker from './FTTrainerPromotionPicker.vue'

vi.mock('~/services/dashboard/promotion-templates.service', () => ({
  promotionTemplatesService: {
    listPromotionTemplates: vi.fn().mockResolvedValue({
      items: [
        {
          id: 'promo-1',
          name: 'Primeira sessão',
          label: 'Primeira sessão',
          discountPercent: 20,
          startsAt: '2026-01-01',
          endsAt: '2026-12-31',
          isActive: true,
        },
      ],
    }),
  },
}))

describe('FTTrainerPromotionPicker', () => {
  it('renders available promotion templates', async () => {
    const wrapper = mountFT(FTTrainerPromotionPicker, {
      props: {
        trainer: mockTrainer(),
      },
      global: {
        stubs: {
          FTPriceLabel: { template: '<div data-testid="price-label-stub" />' },
          FTPromoBadge: { template: '<span data-testid="promo-badge-stub" />' },
        },
      },
    })

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="trainer-promotion-template-promo-1"]').exists()).toBe(true)
    })
  })
})
