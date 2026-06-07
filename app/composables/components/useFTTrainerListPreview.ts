import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { personalTrainersService } from '~/services/catalog/personal-trainers.service'

const PREVIEW_SORT = {
  sortBy: 'rating' as const,
  sortOrder: 'desc' as const,
}

export function useFTTrainerListPreview(limit = 6) {
  const trainers = useState<PersonalTrainer[]>('trainer-list-preview-items', () => [])
  const pending = useState('trainer-list-preview-pending', () => false)
  const error = useState<Error | null>('trainer-list-preview-error', () => null)
  const loaded = useState('trainer-list-preview-loaded', () => false)

  async function fetchPreview(): Promise<void> {
    pending.value = true
    error.value = null

    try {
      const response = await personalTrainersService.list({
        page: 1,
        pageSize: limit,
        ...PREVIEW_SORT,
      })
      trainers.value = response.items
      loaded.value = true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err : new Error('fetchFailed')
    } finally {
      pending.value = false
    }
  }

  if (!loaded.value && !pending.value) {
    fetchPreview()
  }

  const status = computed(() => {
    if (pending.value) {
      return 'pending'
    }
    if (error.value) {
      return 'error'
    }
    return 'success'
  })

  const isLoading = computed(
    () => pending.value || status.value === 'pending' || !loaded.value,
  )

  const isEmpty = computed(() => !isLoading.value && trainers.value.length === 0)

  return {
    trainers: computed(() => trainers.value),
    isLoading,
    isEmpty,
  }
}
