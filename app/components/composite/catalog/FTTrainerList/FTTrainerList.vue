<script setup lang="ts">
const props = withDefaults(defineProps<{
  limit?: number
  variant?: 'full' | 'preview'
}>(), {
  variant: 'full',
  limit: 6,
})

const previewState = props.variant === 'preview'
  ? useFTTrainerListPreview(props.limit)
  : null

const fullState = props.variant === 'full'
  ? useFTTrainerList()
  : null

const trainers = computed(() =>
  props.variant === 'preview'
    ? previewState!.trainers.value
    : fullState!.trainers.value,
)

const isLoading = computed(() =>
  props.variant === 'preview'
    ? previewState!.isLoading.value
    : fullState!.isLoading.value,
)

const isEmpty = computed(() =>
  props.variant === 'preview'
    ? previewState!.isEmpty.value
    : fullState!.isEmpty.value,
)

const clearFilters = props.variant === 'full'
  ? fullState!.clearFilters
  : () => {}

const skeletonCount = computed(() =>
  props.variant === 'preview' ? props.limit : 6,
)
</script>

<template>
  <div>
    <div
      v-if="isLoading"
      class="flex flex-col xl:grid xl:grid-cols-2 xl:gap-4"
      data-testid="trainer-list-loading"
      aria-busy="true"
      :aria-label="$t('catalog.loadingTrainers')"
    >
      <FTTrainerCardSkeleton
        v-for="index in skeletonCount"
        :key="index"
      />
    </div>

    <FTEmptyState
      v-else-if="isEmpty"
      variant="search"
      :title="$t(variant === 'preview' ? 'landing.trainers.empty' : 'catalog.noTrainersFound')"
      test-id="trainer-list-empty"
    >
      <UButton
        v-if="variant === 'full'"
        color="primary"
        variant="solid"
        class="rounded-full px-6"
        @click="clearFilters"
      >
        {{ $t('catalog.clearFilters') }}
      </UButton>
    </FTEmptyState>

    <div
      v-else
      class="flex flex-col pb-24 lg:pb-0 xl:grid xl:grid-cols-2 xl:gap-4"
      data-testid="trainer-list"
    >
      <FTTrainerCard
        v-for="trainer in trainers"
        :key="trainer.id"
        :trainer="trainer"
        class="xl:rounded-2xl xl:border xl:border-slate-100/80 xl:px-4 xl:hover:border-violet-200/50"
      />
    </div>
  </div>
</template>
