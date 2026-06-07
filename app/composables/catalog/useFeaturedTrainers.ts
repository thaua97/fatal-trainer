import type { FeaturedTrainersResponse } from '#shared/types/api'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { personalTrainersService } from '~/services/catalog/personal-trainers.service'

export function useFeaturedTrainers() {
  const items = useState<PersonalTrainer[]>('featured-trainers-items', () => [])
  const pending = useState('featured-trainers-pending', () => false)
  const error = useState<Error | null>('featured-trainers-error', () => null)
  const lastResponse = useState<FeaturedTrainersResponse | null>('featured-trainers-response', () => null)

  async function fetchFeatured(): Promise<void> {
    pending.value = true
    error.value = null

    try {
      const response = await personalTrainersService.listFeatured()
      lastResponse.value = response
      items.value = response.items
    } catch (err: unknown) {
      error.value = err instanceof Error ? err : new Error('fetchFailed')
    } finally {
      pending.value = false
    }
  }

  if (lastResponse.value == null && !pending.value) {
    fetchFeatured()
  }

  const trainers = computed(() => items.value)
  const data = computed(() => lastResponse.value)
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
    data,
    trainers,
    pending,
    status,
    error,
    refresh: fetchFeatured,
  }
}
