import type { TrainerDetailResponse } from '#shared/types/api'

export function useTrainerProfile(id: MaybeRefOrGetter<string>) {
  const trainerId = computed(() => toValue(id))

  const { data, pending, error } = useFetch<TrainerDetailResponse>(
    () => `/api/personal-trainers/${trainerId.value}`,
    {
      watch: [trainerId],
    },
  )

  const trainer = computed(() => data.value?.trainer)

  return {
    trainer,
    pending,
    error,
  }
}
