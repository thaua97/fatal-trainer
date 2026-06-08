// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import FTCityPicker from './FTCityPicker.vue'

describe('FTCityPicker', () => {
  it('renders masked trigger before editing', async () => {
    const wrapper = await mountSuspended(FTCityPicker, {
      props: {
        city: 'São Paulo',
        state: 'SP',
      },
    })

    expect(wrapper.find('[data-testid="city-picker"]').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(false)
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

    const trigger = wrapper.find('[data-testid="city-picker"]')
    expect(trigger.text()).toContain('Pelotas, RS')
    expect(trigger.text()).not.toContain('cityPicker.placeholder')
  })

  it('reveals input menu when trigger is clicked', async () => {
    const wrapper = await mountSuspended(FTCityPicker, {
      props: {
        city: '',
        state: '',
        placeholder: 'Buscar cidade',
      },
    })

    await wrapper.find('[data-testid="city-picker"] button').trigger('click')
    await nextTick()

    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('placeholder')).toBe('Buscar cidade')
  })

  it('hides the geolocation button by default', async () => {
    const wrapper = await mountSuspended(FTCityPicker, {
      props: { city: '', state: '' },
    })

    expect(wrapper.find('[data-testid="city-picker-detect"]').exists()).toBe(false)
  })

  it('renders geolocation button inside the field when enabled', async () => {
    const wrapper = await mountSuspended(FTCityPicker, {
      props: { city: '', state: '', withGeolocation: true },
    })

    const picker = wrapper.find('[data-testid="city-picker"]')
    const button = picker.find('[data-testid="city-picker-detect"]')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(wrapper.emitted('detect')).toBeTruthy()
  })

  it('shows the geolocation error message', async () => {
    const wrapper = await mountSuspended(FTCityPicker, {
      props: {
        city: '',
        state: '',
        withGeolocation: true,
        geoError: 'Permissão de localização negada.',
      },
    })

    expect(wrapper.text()).toContain('Permissão de localização negada.')
  })

  it('uses custom label and placeholder when provided', async () => {
    const wrapper = await mountSuspended(FTCityPicker, {
      props: {
        city: '',
        state: '',
        label: 'Cidade',
        placeholder: 'Buscar cidade',
      },
    })

    expect(wrapper.text()).toContain('Cidade')
    expect(wrapper.find('[data-testid="city-picker"]').text()).toContain('Buscar cidade')
  })
})
