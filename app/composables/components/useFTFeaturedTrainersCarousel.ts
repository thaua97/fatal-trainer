import type { FeaturedCarouselMode } from '#shared/domain/catalog/services/build-featured-carousel'

export function useFTFeaturedTrainersCarousel() {
  const { trainers, mode, pending, error, loaded, fetchEnabled } = useFeaturedTrainers()
  const { isAwaitingCity } = useCatalogCityGate()
  const { t } = useI18n()

  const isLoading = computed(
    () => fetchEnabled.value && (pending.value || (!loaded.value && !error.value)),
  )

  const hasError = computed(() => !pending.value && error.value != null)

  const carouselMode = computed<FeaturedCarouselMode>(() =>
    hasError.value ? 'hidden' : mode.value,
  )

  const shouldShow = computed(
    () =>
      !isAwaitingCity.value
      && !hasError.value
      && (isLoading.value || carouselMode.value !== 'hidden'),
  )

  const isEmpty = computed(
    () => !isLoading.value && carouselMode.value === 'hidden',
  )

  const sectionTitleKey = computed(() =>
    carouselMode.value === 'recommended'
      ? 'catalog.recommendedTitle'
      : 'catalog.featuredTitle',
  )

  const sectionTitle = computed(() => t(sectionTitleKey.value))

  return {
    trainers,
    mode: carouselMode,
    isLoading,
    isEmpty,
    hasError,
    shouldShow,
    sectionTitleKey,
    sectionTitle,
  }
}
