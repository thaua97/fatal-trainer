import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { personalTrainersService } from '~/services/catalog/personal-trainers.service'

export function useTrainerProfile(id: MaybeRefOrGetter<string>) {
  const trainerId = computed(() => toValue(id))
  const trainer = useState<PersonalTrainer | null>('trainer-profile-current', () => null)
  const pending = useState('trainer-profile-pending', () => false)
  const error = useState<Error | null>('trainer-profile-error', () => null)

  async function fetchTrainer(id: string): Promise<void> {
    if (!id) {
      trainer.value = null
      return
    }

    pending.value = true
    error.value = null

    try {
      const response = await personalTrainersService.getById(id)
      trainer.value = response.trainer
    } catch (err: unknown) {
      trainer.value = null
      error.value = err instanceof Error ? err : new Error('fetchFailed')
    } finally {
      pending.value = false
    }
  }

  watch(trainerId, (id) => {
    fetchTrainer(id)
  }, { immediate: true })

  async function refresh(): Promise<void> {
    await fetchTrainer(trainerId.value)
  }

  return {
    trainer: computed(() => trainer.value),
    pending,
    error,
    refresh,
  }
}
