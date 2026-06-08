import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { personalTrainersService } from '~/services/catalog/personal-trainers.service'

export function useTrainerProfile(id: MaybeRefOrGetter<string>) {
  const trainerId = computed(() => toValue(id))

  const { data, pending, error, refresh } = useAsyncData(
    () => `trainer-profile-${trainerId.value}`,
    async () => {
      const currentId = trainerId.value
      if (!currentId) {
        return null
      }

      const response = await personalTrainersService.getById(currentId)
      return response.trainer
    },
    { watch: [trainerId] },
  )

  const trainer = computed<PersonalTrainer | null>(() => data.value ?? null)

  return {
    trainer,
    pending,
    error,
    refresh,
  }
}
