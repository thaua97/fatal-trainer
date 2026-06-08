import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import type { BrazilianCity } from '#shared/data/brazilian-cities'
import { useGeoLocation } from '~/composables/core/useGeoLocation'

const SAMPLE_CITY: BrazilianCity = {
  label: 'São Paulo - SP',
  city: 'São Paulo',
  state: 'SP',
  value: 'sao-paulo-sp',
}

function stubGeolocation(impl: Partial<Geolocation>) {
  vi.stubGlobal('navigator', { geolocation: impl })
}

describe('useGeoLocation', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('detects a city using the injected resolver', async () => {
    stubGeolocation({
      getCurrentPosition: (success) => {
        success({ coords: { latitude: -23.5, longitude: -46.6 } } as GeolocationPosition)
      },
    })

    const geo = useGeoLocation({ resolver: () => SAMPLE_CITY })
    const result = await geo.detectByBrowser()

    expect(result).toEqual({ city: 'São Paulo', state: 'SP', value: 'sao-paulo-sp' })
    expect(geo.selectedLocation.value).toEqual(result)
    expect(geo.error.value).toBeNull()
    expect(geo.pending.value).toBe(false)
  })

  it('reports permission-denied errors', async () => {
    stubGeolocation({
      getCurrentPosition: (_success, error) => {
        error?.({ code: 1 } as GeolocationPositionError)
      },
    })

    const geo = useGeoLocation({ resolver: () => SAMPLE_CITY })
    const result = await geo.detectByBrowser()

    expect(result).toBeNull()
    expect(geo.error.value).toBe('permission-denied')
  })

  it('reports position-unavailable errors', async () => {
    stubGeolocation({
      getCurrentPosition: (_success, error) => {
        error?.({ code: 2 } as GeolocationPositionError)
      },
    })

    const geo = useGeoLocation({ resolver: () => SAMPLE_CITY })
    await geo.detectByBrowser()

    expect(geo.error.value).toBe('position-unavailable')
  })

  it('falls back to manual when the resolver returns null', async () => {
    stubGeolocation({
      getCurrentPosition: (success) => {
        success({ coords: { latitude: 0, longitude: 0 } } as GeolocationPosition)
      },
    })

    const geo = useGeoLocation()
    const result = await geo.detectByBrowser()

    expect(result).toBeNull()
    expect(geo.error.value).toBe('manual')
  })

  it('flags unsupported when geolocation is missing', async () => {
    vi.stubGlobal('navigator', {})

    const geo = useGeoLocation()
    const result = await geo.detectByBrowser()

    expect(result).toBeNull()
    expect(geo.error.value).toBe('unsupported')
    expect(geo.isSupported.value).toBe(false)
  })

  it('selects a city by name and persists it', async () => {
    const geo = useGeoLocation()
    geo.selectByName(SAMPLE_CITY)
    await nextTick()

    expect(geo.selectedLocation.value).toEqual({
      city: 'São Paulo',
      state: 'SP',
      value: 'sao-paulo-sp',
    })
    expect(window.localStorage.getItem('ft:geo-location')).toBe(
      JSON.stringify({ city: 'São Paulo', state: 'SP', value: 'sao-paulo-sp' }),
    )
  })

  it('clears the selected location', async () => {
    const geo = useGeoLocation()
    geo.selectByName(SAMPLE_CITY)
    await nextTick()

    geo.clear()
    await nextTick()

    expect(geo.selectedLocation.value).toBeNull()
    expect(window.localStorage.getItem('ft:geo-location')).toBeNull()
  })

  it('restores a previously persisted location', () => {
    window.localStorage.setItem(
      'ft:geo-location',
      JSON.stringify({ city: 'Pelotas', state: 'RS', value: 'pelotas-rs' }),
    )

    const geo = useGeoLocation()
    expect(geo.selectedLocation.value).toEqual({
      city: 'Pelotas',
      state: 'RS',
      value: 'pelotas-rs',
    })
  })
})
