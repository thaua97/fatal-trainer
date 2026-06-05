import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTProfileCta from './FTProfileCta.vue'
import { mockPromoTrainer, mockTrainer } from '@tests/helpers/mock-trainer'

describe('FTProfileCta', () => {
  it('renders hire button', () => {
    const wrapper = mountFT(FTProfileCta, {
      props: { trainer: mockTrainer() },
    })

    expect(wrapper.find('[data-testid="trainer-profile-cta"]').exists()).toBe(true)
  })

  it('shows promotional price above cta when trainer is on promotion', () => {
    const wrapper = mountFT(FTProfileCta, {
      props: { trainer: mockPromoTrainer() },
    })

    expect(wrapper.find('[data-testid="promo-badge"]').exists()).toBe(true)
  })
})
