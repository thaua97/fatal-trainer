import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTLandingTrainersSection from './FTLandingTrainersSection.vue'

describe('FTLandingTrainersSection', () => {
  it('renders section title and view all link', () => {
    const wrapper = mountFT(FTLandingTrainersSection, {
      global: {
        stubs: {
          FTTrainerList: { template: '<div data-testid="trainer-list-stub" />' },
        },
      },
    })

    expect(wrapper.find('[data-testid="landing-trainers-section"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="landing-trainers-view-all"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-list-stub"]').exists()).toBe(true)
  })
})
