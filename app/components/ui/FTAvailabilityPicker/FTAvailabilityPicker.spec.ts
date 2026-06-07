// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FTAvailabilityPicker from './FTAvailabilityPicker.vue'

describe('FTAvailabilityPicker', () => {
  it('renders weekday and time controls', async () => {
    const wrapper = await mountSuspended(FTAvailabilityPicker, {
      props: {
        modelValue: 'Seg–Sex, 7h–20h',
      },
    })

    expect(wrapper.find('[data-testid="availability-picker"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-info-availability-days"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-info-availability-hours"]').exists()).toBe(true)
  })
})
