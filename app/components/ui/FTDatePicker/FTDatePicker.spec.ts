// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FTDatePicker from './FTDatePicker.vue'

describe('FTDatePicker', () => {
  it('renders calendar trigger with ISO value', async () => {
    const wrapper = await mountSuspended(FTDatePicker, {
      props: {
        modelValue: '2026-06-01',
        testId: 'report-date-picker',
      },
    })

    expect(wrapper.find('[data-testid="report-date-picker"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('2026')
  })
})
