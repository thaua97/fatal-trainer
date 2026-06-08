import type { FeaturedCarouselMode } from '#shared/domain/catalog/services/build-featured-carousel'
import { buildFeaturedCarouselItems } from '#shared/domain/catalog/services/build-featured-carousel'
import { filterTrainers } from '#shared/domain/catalog/services/filter-trainers'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { useCatalogCityGate } from '~/composables/catalog/useCatalogCityGate'
import { useTrainerFilters } from '~/composables/catalog/useTrainerFilters'
import { personalTrainersService } from '~/services/catalog/personal-trainers.service'
import { parseApiError } from '~/services/api/extract-api-errors'
import { resolveToastMessage } from '~/composables/core/useFTToast'

const CAROUSEL_MAX_SLIDES = 6
const RATED_CANDIDATES_PAGE_SIZE = 12

const RATING_SORT = {
  sortBy: 'rating' as const,
  sortOrder: 'desc' as const,
}

export function useFeaturedTrainers() {
  const { t } = useI18n()
  const toast = useFTToast()
  const { filters } = useTrainerFilters()
  const { fetchEnabled } = useCatalogCityGate()

  const items = useState<PersonalTrainer[]>('featured-trainers-items', () => [])
  const mode = useState<FeaturedCarouselMode>('featured-trainers-mode', () => 'hidden')
  const pending = useState('featured-trainers-pending', () => false)
  const error = useState<Error | null>('featured-trainers-error', () => null)
  const loaded = useState('featured-trainers-loaded', () => false)
  const fetchedCityKey = useState<string | null>('featured-trainers-city-key', () => null)
  let fetchGeneration = 0

  const cityFilter = computed(() => filters.value.city?.trim() || undefined)
  const cityKey = computed(() => cityFilter.value ?? '')

  function resetCarouselState(): void {
    items.value = []
    mode.value = 'hidden'
    loaded.value = false
    fetchedCityKey.value = null
    error.value = null
  }

  async function fetchFeatured(): Promise<void> {
    if (!fetchEnabled.value) {
      return
    }

    const generation = ++fetchGeneration
    pending.value = true
    error.value = null

    try {
      const city = cityFilter.value
      const [featuredResponse, ratedResponse] = await Promise.all([
        personalTrainersService.listFeatured(),
        personalTrainersService.list({
          page: 1,
          pageSize: RATED_CANDIDATES_PAGE_SIZE,
          city,
          ...RATING_SORT,
        }),
      ])

      const featuredInCity = filterTrainers(featuredResponse.items, { city })

      if (generation !== fetchGeneration) {
        return
      }

      const carousel = buildFeaturedCarouselItems(
        featuredInCity,
        ratedResponse.items,
        CAROUSEL_MAX_SLIDES,
      )

      items.value = carousel.items
      mode.value = carousel.mode
      loaded.value = true
      fetchedCityKey.value = cityKey.value
    } catch (err: unknown) {
      if (generation !== fetchGeneration) {
        return
      }

      error.value = err instanceof Error ? err : new Error('fetchFailed')
      const parsed = parseApiError(err, 'error.network')
      toast.error(resolveToastMessage(t, parsed.message))
      items.value = []
      mode.value = 'hidden'
      loaded.value = true
      fetchedCityKey.value = cityKey.value
    } finally {
      if (generation === fetchGeneration) {
        pending.value = false
      }
    }
  }

  function requestFetch(force = false): void {
    if (!fetchEnabled.value) {
      resetCarouselState()
      return
    }

    if (!force && loaded.value && fetchedCityKey.value === cityKey.value) {
      return
    }

    pending.value = false
    void fetchFeatured()
  }

  if (import.meta.client) {
    watch(
      () => [fetchEnabled.value, cityKey.value] as const,
      ([enabled]) => {
        if (!enabled) {
          resetCarouselState()
          return
        }

        requestFetch(true)
      },
      { immediate: true },
    )
  }

  const trainers = computed(() => items.value)
  const errorMessage = computed(() => error.value ? t('error.network') : null)
  const status = computed(() => {
    if (pending.value) {
      return 'pending'
    }
    if (error.value) {
      return 'error'
    }
    return 'success'
  })

  return {
    trainers,
    mode: computed(() => mode.value),
    pending,
    loaded: computed(() => loaded.value),
    fetchEnabled,
    status,
    error,
    errorMessage,
    refresh: () => requestFetch(true),
  }
}
