// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FTProfileEditPricing from './FTProfileEditPricing.vue'

describe('FTProfileEditPricing', () => {
  it('renders session and monthly toggle options', async () => {
    const wrapper = await mountSuspended(FTProfileEditPricing, {
      props: {
        servicePrice: 100,
      },
    })

    expect(wrapper.find('[data-testid="profile-edit-pricing"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="profile-edit-price-view-session"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="profile-edit-price-view-monthly"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="profile-edit-price-view-session"]').text()).toMatch(/sess[aã]o|session/i)
    expect(wrapper.find('[data-testid="profile-edit-price-view-monthly"]').text()).toMatch(/mensal|monthly/i)
  })
})
