// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import FTCityPicker from './FTCityPicker.vue'

describe('FTCityPicker', () => {
  it('renders searchable city input menu', async () => {
    const wrapper = await mountSuspended(FTCityPicker, {
      props: {
        city: 'São Paulo',
        state: 'SP',
      },
    })

    expect(wrapper.find('[data-testid="city-picker"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-info-city"]').exists()).toBe(true)
  })

  it('shows map pin icon and formatted city label when selected', async () => {
    const wrapper = await mountSuspended(FTCityPicker, {
      props: {
        city: 'Pelotas',
        state: 'RS',
      },
    })

    await flushPromises()
    await nextTick()

    expect(wrapper.find('input').element.value).toBe('Pelotas, RS')
    expect(wrapper.find('[data-slot="leadingIcon"]').classes().join(' ')).toContain('i-lucide-map-pin')
  })
})
