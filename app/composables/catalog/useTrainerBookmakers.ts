import { useLocalStorage } from '~/composables/core/useLocalStorage'
import { favoritesService } from '~/services/catalog/favorites.service'

export const FAVORITE_TRAINER_IDS_KEY = 'ft:favorite-trainer-ids'

export function useTrainerBookmakers() {
  const { isAuthenticated, initialized } = useAuth()
  const localIds = useLocalStorage<string[]>(FAVORITE_TRAINER_IDS_KEY, [])
  const serverIds = useState<string[]>('trainer-bookmaker-ids', () => [])
  const pending = useState('trainer-bookmakers-pending', () => false)
  const hydrated = useState('trainer-bookmakers-hydrated', () => false)

  const favoriteIds = computed(() => (
    isAuthenticated.value ? serverIds.value : localIds.value
  ))

  function isFavorite(trainerId: string): boolean {
    return favoriteIds.value.includes(trainerId)
  }

  async function hydrateFromServer(): Promise<void> {
    if (!isAuthenticated.value) {
      return
    }

    try {
      const response = await favoritesService.list({ page: 1, pageSize: 1000 })
      serverIds.value = response.items.map((trainer) => trainer.id)
      hydrated.value = true
    } catch {
      // Keep existing cache when hydration fails
    }
  }

  watch([isAuthenticated, initialized], ([authenticated, ready]) => {
    if (!ready) {
      return
    }

    if (authenticated) {
      if (!hydrated.value) {
        hydrateFromServer()
      }
      return
    }

    serverIds.value = []
    hydrated.value = false
  }, { immediate: true })

  async function toggleFavorite(trainerId: string): Promise<void> {
    if (pending.value) {
      return
    }

    const wasFavorite = isFavorite(trainerId)

    if (!isAuthenticated.value) {
      localIds.value = wasFavorite
        ? localIds.value.filter((id) => id !== trainerId)
        : [...localIds.value, trainerId]
      return
    }

    pending.value = true
    const previousIds = [...serverIds.value]

    serverIds.value = wasFavorite
      ? serverIds.value.filter((id) => id !== trainerId)
      : [...serverIds.value, trainerId]

    try {
      if (wasFavorite) {
        await favoritesService.remove(trainerId)
      } else {
        await favoritesService.add(trainerId)
      }
    } catch {
      serverIds.value = previousIds
    } finally {
      pending.value = false
    }
  }

  async function syncFromLocalStorage(): Promise<void> {
    if (!isAuthenticated.value) {
      return
    }

    const ids = [...localIds.value]
    if (ids.length === 0) {
      return
    }

    pending.value = true

    try {
      await favoritesService.sync({ trainerIds: ids })
      localIds.value = []
      await hydrateFromServer()
    } finally {
      pending.value = false
    }
  }

  return {
    favoriteIds,
    pending,
    isFavorite,
    toggleFavorite,
    syncFromLocalStorage,
    hydrateFromServer,
  }
}
