<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const { t } = useI18n()
const trainerRef = toRef(props, 'trainer')
const { reviews, reviewCount, hasReviews } = useFTProfileReviewList(trainerRef)

const reviewsTitle = computed(() => t('profile.reviews', { count: reviewCount.value }))
</script>

<template>
  <FTProfileSection
    v-if="hasReviews"
    :title="reviewsTitle"
    test-id="trainer-reviews"
  >
    <div class="divide-y divide-slate-100">
      <article
        v-for="(review, index) in reviews"
        :key="index"
        class="py-4 first:pt-0 last:pb-0"
      >
        <div class="flex items-start gap-3">
          <FTAvatar :name="review.author" size="sm" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <p class="font-semibold text-slate-900">
                {{ review.author }}
              </p>
              <FTStarRating :rating="review.rating" />
            </div>
            <p class="mt-2 text-sm leading-relaxed text-slate-600">
              {{ review.comment }}
            </p>
          </div>
        </div>
      </article>
    </div>
  </FTProfileSection>
</template>
