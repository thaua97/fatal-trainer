import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import { useFTCitySelector } from '~/composables/components/useFTCitySelector'
import { mockUpdateTrainerFilters } from '@tests/helpers/mock-trainer-filters'
import type { GeoResolver } from '~/composables/core/useGeoLocation'

const mocks = vi.hoisted(() => ({
  cities: [
    { label: 'São Paulo - SP', city: 'São Paulo', state: 'SP', value: 'sao-paulo-sp' },
    { label: 'Pelotas - RS', city: 'Pelotas', state: 'RS', value: 'pelotas-rs' },
  ],
}))

vi.mock('~/composables/components/useFTBrazilianCities', async () => {
  const { ref } = await import('vue')
  return {
    useFTBrazilianCities: () => ({
      cities: ref(mocks.cities),
      searchTerm: ref(''),
      filteredItems: ref(mocks.cities),
      loading: ref(false),
    }),
  }
})

const Harness = defineComponent({
  props: {
    resolver: { type: Function, default: undefined },
  },
  setup(props) {
    return useFTCitySelector({ resolver: props.resolver as GeoResolver | undefined })
  },
  template: '<div />',
})

describe('useFTCitySelector', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('pushes the selected city to the URL filter', async () => {
    const wrapper = mountFT(Harness)

    wrapper.vm.city = 'São Paulo'
    wrapper.vm.state = 'SP'
    await nextTick()

    expect(mockUpdateTrainerFilters).toHaveBeenCalledWith({ city: 'São Paulo' })
  })

  it('clears the city filter', async () => {
    const wrapper = mountFT(Harness)

    wrapper.vm.city = 'São Paulo'
    wrapper.vm.state = 'SP'
    await nextTick()

    wrapper.vm.onClear()
    await nextTick()

    expect(mockUpdateTrainerFilters).toHaveBeenLastCalledWith({ city: undefined })
  })

  it('detects a city and applies it to the filter', async () => {
    const resolver: GeoResolver = () => mocks.cities[0]!
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: (success: PositionCallback) => {
          success({ coords: { latitude: -23.5, longitude: -46.6 } } as GeolocationPosition)
        },
      },
    })

    const wrapper = mountFT(Harness, { props: { resolver } })
    await wrapper.vm.onDetect()
    await nextTick()

    expect(mockUpdateTrainerFilters).toHaveBeenCalledWith({ city: 'São Paulo' })
    expect(wrapper.vm.geoError).toBeUndefined()
  })

  it('restores the persisted location on mount', async () => {
    window.localStorage.setItem(
      'ft:geo-location',
      JSON.stringify({ city: 'Pelotas', state: 'RS', value: 'pelotas-rs' }),
    )

    const wrapper = mountFT(Harness)
    await nextTick()

    expect(wrapper.vm.city).toBe('Pelotas')
    expect(mockUpdateTrainerFilters).toHaveBeenCalledWith({ city: 'Pelotas' })
  })

  it('exposes a localized error when geolocation is unsupported', async () => {
    vi.stubGlobal('navigator', {})

    const wrapper = mountFT(Harness)
    await wrapper.vm.onDetect()
    await nextTick()

    expect(wrapper.vm.geoError).toBe(
      'Geolocalização não é suportada neste navegador.',
    )
  })
})
