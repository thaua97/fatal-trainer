// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { Time } from '@internationalized/date'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FTTimePicker from './FTTimePicker.vue'

describe('FTTimePicker', () => {
  it('renders time range controls', async () => {
    const wrapper = await mountSuspended(FTTimePicker, {
      props: {
        modelValue: {
          start: new Time(7, 0),
          end: new Time(20, 0),
        },
        testId: 'availability-hours',
      },
    })

    expect(wrapper.find('[data-testid="availability-hours"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="availability-hours-start"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="availability-hours-end"]').exists()).toBe(true)
  })
})
