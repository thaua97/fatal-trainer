import type { TrainerReviewItem } from '#shared/types/api'
import { reviewsService } from '~/services/reviews/reviews.service'

const DEFAULT_PAGE_SIZE = 10

export function useTrainerReviews(trainerId: MaybeRefOrGetter<string>) {
  const id = computed(() => toValue(trainerId))
  const page = ref(1)
  const pageSize = DEFAULT_PAGE_SIZE

  const items = ref<TrainerReviewItem[]>([])
  const total = ref(0)
  const pending = ref(false)
  const error = ref<Error | null>(null)

  async function fetchReviews(): Promise<void> {
    const currentId = id.value
    if (!currentId) {
      items.value = []
      total.value = 0
      return
    }

    pending.value = true
    error.value = null

    try {
      const response = await reviewsService.list(currentId, {
        page: page.value,
        pageSize,
      })
      items.value = response.items
      total.value = response.total
    } catch (err: unknown) {
      items.value = []
      total.value = 0
      error.value = err instanceof Error ? err : new Error('fetchFailed')
    } finally {
      pending.value = false
    }
  }

  if (import.meta.client) {
    watch([id, page], () => {
      fetchReviews()
    }, { immediate: true })
  }

  function refresh() {
    page.value = 1
    return fetchReviews()
  }

  function goToPage(nextPage: number) {
    page.value = nextPage
  }

  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))
  const hasReviews = computed(() => total.value > 0)
  const showPagination = computed(() => total.value > pageSize)

  return {
    items: computed(() => items.value),
    total: computed(() => total.value),
    page,
    pageSize,
    pageCount,
    pending,
    error,
    hasReviews,
    showPagination,
    refresh,
    goToPage,
  }
}
