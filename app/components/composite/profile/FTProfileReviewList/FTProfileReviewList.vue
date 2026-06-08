<script setup lang="ts">
import type { TrainerReviewItem } from '#shared/types/api'

defineProps<{
  reviews: TrainerReviewItem[]
}>()
</script>

<template>
  <div
    class="divide-y divide-slate-100"
    data-testid="profile-review-list"
  >
    <article
      v-for="review in reviews"
      :key="review.id"
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
</template>
