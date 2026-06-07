import type { Ref } from 'vue'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { PaginatedTrainersResponse } from '#shared/types/api'
import type { ListQuery } from '#shared/domain/catalog/value-objects/list-query'
import { DEFAULT_LIST_QUERY } from '#shared/domain/catalog/value-objects/list-query'
import { personalTrainersService } from '~/services/catalog/personal-trainers.service'

export interface UsePersonalTrainersOptions {
  enabled?: Ref<boolean>
}

export function usePersonalTrainers(
  initialQuery: Partial<ListQuery> = {},
  options: UsePersonalTrainersOptions = {},
) {
  const enabled = options.enabled ?? ref(true)
  const query = useState<ListQuery>('personal-trainers-query', () => ({
    ...DEFAULT_LIST_QUERY,
    ...initialQuery,
  }))

  const accumulatedTrainers = useState<PersonalTrainer[]>('personal-trainers-accumulated', () => [])
  const pending = useState('personal-trainers-pending', () => false)
  const error = useState<Error | null>('personal-trainers-error', () => null)
  const meta = useState<{ total: number, hasMore: boolean }>('personal-trainers-meta', () => ({
    total: 0,
    hasMore: false,
  }))
  const lastResponse = useState<PaginatedTrainersResponse | null>('personal-trainers-last-response', () => null)

  const queryFilterKey = computed(() => {
    const { page: _, ...rest } = query.value
    return JSON.stringify(rest)
  })

  watch(queryFilterKey, () => {
    accumulatedTrainers.value = []
    if (query.value.page !== 1) {
      query.value.page = 1
    }
  })

  async function fetchTrainers(): Promise<void> {
    pending.value = true
    error.value = null

    try {
      const response = await personalTrainersService.list(query.value)
      lastResponse.value = response
      meta.value = {
        total: response.total,
        hasMore: response.hasMore ?? response.page * response.pageSize < response.total,
      }

      if (response.page <= 1) {
        accumulatedTrainers.value = response.items
        return
      }

      const existingIds = new Set(accumulatedTrainers.value.map(trainer => trainer.id))
      const nextItems = response.items.filter(trainer => !existingIds.has(trainer.id))
      accumulatedTrainers.value = [...accumulatedTrainers.value, ...nextItems]
    } catch (err: unknown) {
      error.value = err instanceof Error ? err : new Error('fetchFailed')
    } finally {
      pending.value = false
    }
  }

  watch(enabled, (isEnabled) => {
    if (isEnabled) {
      fetchTrainers()
    }
  })

  watch(
    query,
    () => {
      if (enabled.value) {
        fetchTrainers()
      }
    },
    { deep: true, immediate: true },
  )

  const trainers = computed(() => accumulatedTrainers.value)
  const total = computed(() => meta.value.total)
  const hasMore = computed(() => meta.value.hasMore)
  const isLoadingMore = computed(() => pending.value && query.value.page > 1)

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

  function loadMore() {
    if (pending.value || !hasMore.value) {
      return
    }

    query.value.page += 1
  }

  return {
    query,
    data,
    trainers,
    total,
    hasMore,
    pending,
    isLoadingMore,
    status,
    error,
    refresh: fetchTrainers,
    loadMore,
  }
}
