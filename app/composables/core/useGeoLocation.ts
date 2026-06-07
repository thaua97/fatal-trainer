import type { BrazilianCity } from '#shared/data/brazilian-cities'

export type GeoError =
  | 'unsupported'
  | 'permission-denied'
  | 'position-unavailable'
  | 'manual'

export interface GeoLocationValue {
  city: string
  state: string
  value: string
}

export interface GeoCoordinates {
  latitude: number
  longitude: number
}

/**
 * Resolves browser coordinates into a Brazilian city. Pluggable so an external
 * reverse-geocoding API can be injected later; the default is offline and
 * best-effort (returns `null`, which surfaces a `manual` fallback).
 */
export type GeoResolver = (
  coords: GeoCoordinates,
) => Promise<BrazilianCity | null> | BrazilianCity | null

export interface UseGeoLocationOptions {
  resolver?: GeoResolver
  storageKey?: string
}

const DEFAULT_STORAGE_KEY = 'ft:geo-location'

function toGeoError(cause: unknown): GeoError {
  if (typeof cause === 'object' && cause !== null && 'code' in cause) {
    const code = (cause as GeolocationPositionError).code
    if (code === 1) {
      return 'permission-denied'
    }
    if (code === 2 || code === 3) {
      return 'position-unavailable'
    }
  }
  return 'position-unavailable'
}

function toLocationValue(city: BrazilianCity): GeoLocationValue {
  return { city: city.city, state: city.state, value: city.value }
}

export function useGeoLocation(options: UseGeoLocationOptions = {}) {
  const resolve: GeoResolver = options.resolver ?? (() => null)
  const selectedLocation = useLocalStorage<GeoLocationValue | null>(
    options.storageKey ?? DEFAULT_STORAGE_KEY,
    null,
  )
  const pending = ref(false)
  const error = ref<GeoError | null>(null)

  const isSupported = computed(
    () => typeof navigator !== 'undefined' && 'geolocation' in navigator,
  )

  function getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  async function detectByBrowser(): Promise<GeoLocationValue | null> {
    error.value = null

    if (!isSupported.value) {
      error.value = 'unsupported'
      return null
    }

    pending.value = true
    try {
      const position = await getCurrentPosition()
      const match = await resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })

      if (!match) {
        error.value = 'manual'
        return null
      }

      const value = toLocationValue(match)
      selectedLocation.value = value
      return value
    }
    catch (cause) {
      error.value = toGeoError(cause)
      return null
    }
    finally {
      pending.value = false
    }
  }

  function selectByName(city: BrazilianCity): GeoLocationValue {
    const value = toLocationValue(city)
    selectedLocation.value = value
    error.value = null
    return value
  }

  function clear(): void {
    selectedLocation.value = null
    error.value = null
  }

  return {
    selectedLocation,
    pending,
    error,
    isSupported,
    detectByBrowser,
    selectByName,
    clear,
  }
}
