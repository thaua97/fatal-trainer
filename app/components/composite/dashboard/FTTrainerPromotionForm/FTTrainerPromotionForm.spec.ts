import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import { mockPromoTrainer } from '@tests/helpers/mock-trainer'
import FTTrainerPromotionForm from './FTTrainerPromotionForm.vue'

describe('FTTrainerPromotionForm', () => {
  it('renders promotion preview for trainer with promotion', () => {
    const wrapper = mountFT(FTTrainerPromotionForm, {
      props: { trainer: mockPromoTrainer() },
      global: {
        stubs: {
          FTPriceLabel: { template: '<div data-testid="price-label-stub" />' },
          FTPromoBadge: { template: '<span data-testid="promo-badge-stub" />' },
        },
      },
    })

    expect(wrapper.find('[data-testid="trainer-promotion-preview"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-promotion-submit"]').exists()).toBe(true)
  })
})
