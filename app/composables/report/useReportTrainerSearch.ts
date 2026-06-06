import { useDebounceFn } from '@vueuse/core'
import type { PaginatedTrainersResponse } from '#shared/types/api'

export interface ReportTrainerOption {
  label: string
  value: string
  avatar: { src: string, alt: string }
  profession: string
}

export function useReportTrainerSearch() {
  const search = ref('')
  const debouncedSearch = ref('')

  const debounceSearch = useDebounceFn((value: string) => {
    debouncedSearch.value = value
  }, 300)

  watch(search, (value) => {
    debounceSearch(value)
  })

  const { data, pending, status } = useFetch<PaginatedTrainersResponse>(
    '/api/personal-trainers',
    {
      query: computed(() => ({
        search: debouncedSearch.value,
        page: 1,
        pageSize: 20,
        sortBy: 'name',
        sortOrder: 'asc',
      })),
      watch: [debouncedSearch],
    },
  )

  const trainerItems = computed<ReportTrainerOption[]>(() =>
    (data.value?.items ?? []).map((trainer) => ({
      label: trainer.name,
      value: trainer.id,
      avatar: {
        src: trainer.photoUrl,
        alt: trainer.name,
      },
      profession: trainer.profession,
    })),
  )

  return {
    search,
    trainerItems,
    pending,
    status,
  }
}
