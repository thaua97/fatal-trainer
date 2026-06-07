import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { mountFT } from '@tests/helpers/mount-ft'
import FTCitySelector from './FTCitySelector.vue'

const FTCityPickerStub = defineComponent({
  name: 'FTCityPicker',
  props: {
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    withGeolocation: { type: Boolean, default: false },
    detecting: { type: Boolean, default: false },
    geoError: { type: String, default: undefined },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    testId: { type: String, default: undefined },
  },
  emits: ['detect', 'update:city', 'update:state'],
  template: `
    <div data-testid="city-picker-stub">
      <span class="label">{{ label }}</span>
      <span class="placeholder">{{ placeholder }}</span>
      <span class="geo-error">{{ geoError }}</span>
      <span class="geo-flag">{{ withGeolocation }}</span>
      <button data-testid="detect" @click="$emit('detect')">detect</button>
    </div>
  `,
})

function mountSelector() {
  return mountFT(FTCitySelector, {
    global: { stubs: { FTCityPicker: FTCityPickerStub } },
  })
}

describe('FTCitySelector', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the city picker with geolocation enabled', () => {
    const wrapper = mountSelector()

    expect(wrapper.find('[data-testid="city-picker-stub"]').exists()).toBe(true)
    expect(wrapper.find('.geo-flag').text()).toBe('true')
  })

  it('passes the localized default label and placeholder', () => {
    const wrapper = mountSelector()

    expect(wrapper.find('.label').text()).toBe('Cidade')
    expect(wrapper.find('.placeholder').text()).toBe('Buscar cidade...')
  })

  it('forwards custom label and placeholder props', () => {
    const wrapper = mountFT(FTCitySelector, {
      props: { label: 'Sua cidade', placeholder: 'Digite aqui' },
      global: { stubs: { FTCityPicker: FTCityPickerStub } },
    })

    expect(wrapper.find('.label').text()).toBe('Sua cidade')
    expect(wrapper.find('.placeholder').text()).toBe('Digite aqui')
  })

  it('surfaces a localized geolocation error after a failed detect', async () => {
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) => {
          error({ code: 1 } as GeolocationPositionError)
        },
      },
    })

    const wrapper = mountSelector()
    await wrapper.find('[data-testid="detect"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('.geo-error').text()).toBe(
      'Permissão de localização negada. Digite sua cidade.',
    )
  })
})
