<script setup lang="ts">
import type { TrainerReviewItem } from '#shared/types/api'

defineProps<{
  reviews: TrainerReviewItem[]
  editableReviewId?: string | null
}>()

const emit = defineEmits<{
  edit: []
}>()

const { t } = useI18n()
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
            <div class="flex shrink-0 items-center gap-1">
              <UButton
                v-if="editableReviewId === review.id"
                variant="ghost"
                color="neutral"
                size="xs"
                icon="i-lucide-pencil"
                :aria-label="t('profile.editReview')"
                class="text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-600"
                data-testid="profile-review-edit"
                @click="emit('edit')"
              />
              <FTStarRating :rating="review.rating" />
            </div>
          </div>
          <p class="mt-2 text-sm leading-relaxed text-slate-600">
            {{ review.comment }}
          </p>
        </div>
      </div>
    </article>
  </div>
</template>
