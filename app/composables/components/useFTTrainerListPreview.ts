import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { personalTrainersService } from '~/services/catalog/personal-trainers.service'

const PREVIEW_SORT = {
  sortBy: 'rating' as const,
  sortOrder: 'desc' as const,
}

export function useFTTrainerListPreview(limit = 6) {
  const { data, pending, error } = useAsyncData(
    `trainer-list-preview-${limit}`,
    () => personalTrainersService.list({
      page: 1,
      pageSize: limit,
      ...PREVIEW_SORT,
    }),
  )

  const trainers = computed<PersonalTrainer[]>(() => data.value?.items ?? [])

  const isLoading = computed(() => pending.value)

  const isEmpty = computed(() => !pending.value && trainers.value.length === 0)

  return {
    trainers,
    isLoading,
    isEmpty,
    error,
  }
}
