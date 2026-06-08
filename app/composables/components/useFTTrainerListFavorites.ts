import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { DEFAULT_LIST_QUERY } from '#shared/domain/catalog/value-objects/list-query'
import { favoritesService } from '~/services/catalog/favorites.service'

export function useFTTrainerListFavorites() {
  const { isAuthenticated, initialized } = useAuth()
  const { favoriteIds } = useTrainerBookmakers()

  const query = ref({
    page: 1,
    pageSize: DEFAULT_LIST_QUERY.pageSize,
  })

  const accumulatedTrainers = ref<PersonalTrainer[]>([])
  const pending = ref(false)
  const error = ref<Error | null>(null)
  const meta = ref({ total: 0, hasMore: false })
  const loaded = ref(false)

  const guestIds = computed(() => favoriteIds.value.join(','))

  async function fetchFavorites(): Promise<void> {
    if (!initialized.value) {
      return
    }

    if (!isAuthenticated.value && guestIds.value.length === 0) {
      accumulatedTrainers.value = []
      meta.value = { total: 0, hasMore: false }
      loaded.value = true
      return
    }

    pending.value = true
    error.value = null

    try {
      const response = isAuthenticated.value
        ? await favoritesService.list({
            page: query.value.page,
            pageSize: query.value.pageSize,
          })
        : await favoritesService.list({
            page: 1,
            pageSize: 100,
            ids: guestIds.value || undefined,
          })

      meta.value = {
        total: response.total,
        hasMore: response.hasMore ?? response.page * response.pageSize < response.total,
      }

      if (response.page <= 1) {
        accumulatedTrainers.value = response.items
      } else {
        const existingIds = new Set(accumulatedTrainers.value.map((trainer) => trainer.id))
        const nextItems = response.items.filter((trainer) => !existingIds.has(trainer.id))
        accumulatedTrainers.value = [...accumulatedTrainers.value, ...nextItems]
      }

      loaded.value = true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err : new Error('fetchFailed')
      loaded.value = true
    } finally {
      pending.value = false
    }
  }

  watch([initialized, isAuthenticated, guestIds], ([ready, authenticated, ids]) => {
    if (!ready) {
      return
    }

    if (!authenticated && ids.length === 0) {
      accumulatedTrainers.value = []
      loaded.value = true
      return
    }

    query.value.page = 1
    accumulatedTrainers.value = []
    fetchFavorites()
  }, { immediate: true })

  watch(() => query.value.page, (page, previousPage) => {
    if (page > 1 && page !== previousPage) {
      fetchFavorites()
    }
  })

  const trainers = computed(() => accumulatedTrainers.value)
  const hasMore = computed(() => isAuthenticated.value && meta.value.hasMore)
  const isLoadingMore = computed(() => pending.value && query.value.page > 1)

  const isLoading = computed(() => {
    if (!initialized.value) {
      return true
    }

    if (!isAuthenticated.value && favoriteIds.value.length === 0) {
      return false
    }

    if (trainers.value.length > 0) {
      return false
    }

    return pending.value || (!loaded.value && !error.value)
  })

  const isEmpty = computed(() => {
    if (!initialized.value) {
      return false
    }

    if (!isAuthenticated.value && favoriteIds.value.length === 0) {
      return true
    }

    return !isLoading.value && trainers.value.length === 0
  })

  function loadMore() {
    if (!isAuthenticated.value || pending.value || !hasMore.value) {
      return
    }

    query.value.page += 1
  }

  return {
    trainers,
    isLoading,
    isLoadingMore,
    isEmpty,
    hasMore,
    loadMore,
  }
}
