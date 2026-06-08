<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const emit = defineEmits<{
  trainerUpdated: []
}>()

const { t } = useI18n()
const trainerId = computed(() => props.trainer.id)
const reviewCount = computed(() => props.trainer.reviewCount ?? 0)

const {
  items,
  total,
  page,
  pageSize,
  pending,
  hasReviews,
  showPagination,
  refresh,
} = useTrainerReviews(trainerId)

const reviewsTitle = computed(() => t('profile.reviews', { count: reviewCount.value || total.value }))

async function handleSubmitted() {
  await refresh()
  emit('trainerUpdated')
}
</script>

<template>
  <FTProfileSection
    :title="reviewsTitle"
    test-id="trainer-reviews"
  >
    <div class="space-y-6">
      <FTProfileReviewForm
        :trainer="trainer"
        @submitted="handleSubmitted"
      />

      <div
        v-if="pending && !items.length"
        class="space-y-4"
        data-testid="profile-reviews-loading"
      >
        <div
          v-for="index in 3"
          :key="index"
          class="h-16 animate-pulse rounded-2xl bg-slate-100"
        />
      </div>

      <FTEmptyState
        v-else-if="!hasReviews"
        :title="t('profile.reviewsEmptyTitle')"
        test-id="profile-reviews-empty"
      >
        <p class="text-sm text-slate-500">
          {{ t('profile.reviewsEmptyDescription') }}
        </p>
      </FTEmptyState>

      <FTProfileReviewList
        v-else
        :reviews="items"
      />

      <FTProfileReviewPagination
        v-if="showPagination"
        v-model:page="page"
        :total="total"
        :page-size="pageSize"
        :disabled="pending"
      />
    </div>
  </FTProfileSection>
</template>
