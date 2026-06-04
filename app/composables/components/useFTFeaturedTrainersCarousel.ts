export function useFTFeaturedTrainersCarousel() {
  const { trainers, pending, status, data, error } = useFeaturedTrainers()

  const isLoading = computed(
    () => pending.value || status.value === 'pending' || data.value == null,
  )

  const isEmpty = computed(() => !isLoading.value && trainers.value.length === 0)

  const hasError = computed(() => !pending.value && error.value != null)

  const shouldShow = computed(
    () => !hasError.value && (isLoading.value || trainers.value.length > 0),
  )

  return {
    trainers,
    isLoading,
    isEmpty,
    hasError,
    shouldShow,
  }
}
