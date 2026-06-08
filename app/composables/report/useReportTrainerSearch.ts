import { useDebounceFn } from '@vueuse/core'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { personalTrainersService } from '~/services/catalog/personal-trainers.service'

export interface ReportTrainerOption {
  label: string
  value: string
  avatar: { src: string, alt: string }
  profession: string
}

export function useReportTrainerSearch() {
  const search = ref('')
  const debouncedSearch = ref('')
  const items = useState<PersonalTrainer[]>('report-trainer-search-items', () => [])
  const pending = useState('report-trainer-search-pending', () => false)
  const error = useState<Error | null>('report-trainer-search-error', () => null)

  const debounceSearch = useDebounceFn((value: string) => {
    debouncedSearch.value = value
  }, 300)

  watch(search, (value) => {
    debounceSearch(value)
  })

  async function fetchTrainers(): Promise<void> {
    pending.value = true
    error.value = null

    try {
      const response = await personalTrainersService.list({
        search: debouncedSearch.value || undefined,
        page: 1,
        pageSize: 20,
        sortBy: 'name',
        sortOrder: 'asc',
      })
      items.value = response.items
    } catch (err: unknown) {
      error.value = err instanceof Error ? err : new Error('fetchFailed')
    } finally {
      pending.value = false
    }
  }

  if (import.meta.client) {
    watch(debouncedSearch, () => {
      fetchTrainers()
    }, { immediate: true })
  }

  const trainerItems = computed<ReportTrainerOption[]>(() =>
    items.value.map((trainer) => ({
      label: trainer.name,
      value: trainer.id,
      avatar: {
        src: trainer.photoUrl,
        alt: trainer.name,
      },
      profession: trainer.profession,
    })),
  )

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
    search,
    trainerItems,
    pending,
    status,
  }
}
