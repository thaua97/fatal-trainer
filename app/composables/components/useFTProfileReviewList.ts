import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

export function useFTProfileReviewList(trainer: Ref<PersonalTrainer | undefined | null>) {
  const reviews = computed(() => trainer.value?.reviews ?? [])
  const reviewCount = computed(() => trainer.value?.reviewCount ?? reviews.value.length)
  const hasReviews = computed(() => reviews.value.length > 0)

  return { reviews, reviewCount, hasReviews }
}
