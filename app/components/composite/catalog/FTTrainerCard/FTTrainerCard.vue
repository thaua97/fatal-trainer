<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { formatModalityLabels } from '#shared/utils/format-modality-labels'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const { t } = useI18n()

const subtitle = computed(() => {
  const parts = [...formatModalityLabels(props.trainer.modalities, t)]
  const specialty = props.trainer.specialties?.[0]
  if (specialty) parts.push(specialty)
  return parts.join(' · ')
})
</script>

<template>
  <NuxtLink
    :to="`/personal-trainers/${trainer.id}`"
    class="group flex min-h-[120px] items-start gap-4 border-b border-slate-100/50 py-5 transition-colors hover:bg-slate-50/50"
    data-testid="trainer-card"
    :aria-label="$t('catalog.viewProfile', { name: trainer.name })"
  >
    <div class="relative shrink-0">
      <div class="overflow-hidden rounded-2xl">
        <FTAvatar
          :src="trainer.photoUrl"
          :name="trainer.name"
          size="lg"
        />
      </div>
    </div>
    <div class="relative min-w-0 flex-1 pr-16">
      <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
        {{ trainer.profession }}
      </p>
      <h2 class="mt-0.5 truncate text-base font-bold text-slate-900">
        {{ trainer.name }}
      </h2>
      <p
        v-if="subtitle"
        class="mt-0.5 truncate text-xs text-slate-400"
      >
        {{ subtitle }}
      </p>
      <div class="mt-2">
        <FTPriceLabel
          :price="trainer.servicePrice"
        />
      </div>
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <span
          v-if="trainer.distanceKm != null"
          class="inline-flex"
        >
          <FTDistanceLabel :distance-km="trainer.distanceKm" />
        </span>
        <template
          v-if="trainer.modalities?.length"
        >
          <FTModalityBadge
            v-for="modality in trainer.modalities"
            :key="modality"
            :modality="modality"
          />
        </template>
      </div>
      <div
        v-if="trainer.rating"
        class="absolute right-0 top-0"
      >
        <FTRatingBadge
          :rating="trainer.rating"
          :review-count="trainer.reviewCount"
        />
      </div>
    </div>
  </NuxtLink>
</template>
