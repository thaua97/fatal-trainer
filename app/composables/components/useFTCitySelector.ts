import type { BrazilianCity } from '#shared/data/brazilian-cities'
import type { GeoError, GeoResolver } from '~/composables/core/useGeoLocation'

const GEO_ERROR_KEYS: Record<GeoError, string> = {
  'unsupported': 'unsupported',
  'permission-denied': 'permissionDenied',
  'position-unavailable': 'positionUnavailable',
  'manual': 'manual',
}

export interface UseFTCitySelectorOptions {
  resolver?: GeoResolver
}

/**
 * Catalog orchestration for the city selector: bridges the persisted
 * geolocation (`useGeoLocation`), the URL-driven `city` filter
 * (`useTrainerFilters`) and the city dataset (`useFTBrazilianCities`).
 *
 * The URL is the source of truth, so multiple selector instances (header,
 * sidebar, drawer) stay in sync; `city`/`state` are local refs wired to a
 * single batched watcher so the picker can update both at once.
 */
export function useFTCitySelector(options: UseFTCitySelectorOptions = {}) {
  const { t } = useI18n()
  const { filters, updateFilters } = useTrainerFilters()
  const { cities } = useFTBrazilianCities()
  const geo = useGeoLocation({ resolver: options.resolver })

  // Initialize from the URL only; the persisted location is applied on mount so
  // the change (from empty) propagates to the URL through the watcher below.
  const city = ref(filters.value.city ?? '')
  const state = ref('')

  function findCity(name: string, uf: string): BrazilianCity | undefined {
    const normalizedName = name.trim()
    const normalizedUf = uf.trim().toUpperCase()
    if (!normalizedName) {
      return undefined
    }

    return cities.value.find(
      item =>
        item.city === normalizedName
        && (!normalizedUf || item.state === normalizedUf),
    )
  }

  watch(
    () => filters.value.city,
    (next) => {
      const value = next ?? ''
      if (value === city.value) {
        return
      }
      city.value = value
      state.value = findCity(value, '')?.state ?? ''
    },
  )

  watch(cities, () => {
    if (city.value && !state.value) {
      state.value = findCity(city.value, '')?.state ?? ''
    }
  })

  watch([city, state], ([nextCity, nextState]) => {
    const trimmed = nextCity.trim()

    if (!trimmed) {
      if (filters.value.city) {
        updateFilters({ city: undefined })
      }
      if (geo.selectedLocation.value) {
        geo.clear()
      }
      return
    }

    if (trimmed !== (filters.value.city ?? '')) {
      updateFilters({ city: trimmed })
    }

    const match = findCity(trimmed, nextState)
    if (match) {
      geo.selectByName(match)
    }
  })

  const geoError = computed(() => {
    if (!geo.error.value) {
      return undefined
    }
    return t(`cityFilter.errors.${GEO_ERROR_KEYS[geo.error.value]}`)
  })

  async function onDetect(): Promise<void> {
    const resolved = await geo.detectByBrowser()
    if (resolved) {
      city.value = resolved.city
      state.value = resolved.state
    }
  }

  function onClear(): void {
    city.value = ''
    state.value = ''
  }

  onMounted(() => {
    if (!filters.value.city && geo.selectedLocation.value) {
      city.value = geo.selectedLocation.value.city
      state.value = geo.selectedLocation.value.state
    }
  })

  return {
    city,
    state,
    detecting: geo.pending,
    geoError,
    isSupported: geo.isSupported,
    onDetect,
    onClear,
  }
}
