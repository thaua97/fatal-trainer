<script setup lang="ts">
const props = withDefaults(defineProps<{
  limit?: number
  variant?: 'full' | 'preview' | 'favorites'
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

const favoritesState = props.variant === 'favorites'
  ? useFTTrainerListFavorites()
  : null

const trainers = computed(() => {
  if (props.variant === 'preview') {
    return previewState!.trainers.value
  }

  if (props.variant === 'favorites') {
    return favoritesState!.trainers.value
  }

  return fullState!.trainers.value
})

const isLoading = computed(() => {
  if (props.variant === 'preview') {
    return previewState!.isLoading.value
  }

  if (props.variant === 'favorites') {
    return favoritesState!.isLoading.value
  }

  return fullState!.isLoading.value
})

const hasFetchError = computed(() => {
  if (props.variant === 'full') {
    return fullState!.hasFetchError.value
  }

  return false
})

const fetchErrorMessage = computed(() => {
  if (props.variant === 'full') {
    return fullState!.errorMessage.value
  }

  return null
})

const refreshList = props.variant === 'full'
  ? fullState!.refresh
  : () => {}

const isEmpty = computed(() => {
  if (props.variant === 'preview') {
    return previewState!.isEmpty.value
  }

  if (props.variant === 'favorites') {
    return favoritesState!.isEmpty.value
  }

  return fullState!.isEmpty.value
})

const isAwaitingCity = computed(() => {
  if (props.variant === 'full') {
    return fullState!.isAwaitingCity.value
  }

  return false
})

const clearFilters = props.variant === 'full'
  ? fullState!.clearFilters
  : () => {}

const hasMore = computed(() => {
  if (props.variant === 'full') {
    return fullState!.hasMore.value
  }

  if (props.variant === 'favorites') {
    return favoritesState!.hasMore.value
  }

  return false
})

const isLoadingMore = computed(() => {
  if (props.variant === 'full') {
    return fullState!.isLoadingMore.value
  }

  if (props.variant === 'favorites') {
    return favoritesState!.isLoadingMore.value
  }

  return false
})

const loadMore = props.variant === 'full'
  ? fullState!.loadMore
  : props.variant === 'favorites'
    ? favoritesState!.loadMore
    : () => {}

const skeletonCount = computed(() => {
  if (props.variant === 'preview') {
    return props.limit
  }

  return 6
})

const emptyTitleKey = computed(() => {
  if (props.variant === 'preview') {
    return 'landing.trainers.empty'
  }

  if (props.variant === 'favorites') {
    return 'favorites.emptyTitle'
  }

  return 'catalog.noTrainersFound'
})
</script>

<template>
  <div>
    <FTEmptyState
      v-if="isAwaitingCity"
      variant="search"
      :title="$t('cityModal.awaitingCity')"
      test-id="trainer-list-awaiting-city"
    />

    <FTErrorState
      v-else-if="hasFetchError"
      :title="$t('catalog.loadFailedTitle')"
      :description="fetchErrorMessage ?? $t('error.network')"
      test-id="trainer-list-error"
    >
      <UButton
        color="primary"
        variant="solid"
        class="rounded-full px-6"
        data-testid="trainer-list-retry"
        @click="refreshList"
      >
        {{ $t('catalog.retry') }}
      </UButton>
    </FTErrorState>

    <div
      v-else-if="isLoading"
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
      :title="$t(emptyTitleKey)"
      test-id="trainer-list-empty"
    >
      <p
        v-if="variant === 'favorites'"
        class="mb-4 text-sm text-slate-500"
      >
        {{ $t('favorites.emptyDescription') }}
      </p>
      <UButton
        v-if="variant === 'full'"
        color="primary"
        variant="solid"
        class="rounded-full px-6"
        @click="clearFilters"
      >
        {{ $t('catalog.clearFilters') }}
      </UButton>
      <UButton
        v-else-if="variant === 'favorites'"
        to="/personal-trainers"
        color="primary"
        variant="solid"
        class="rounded-full px-6"
        data-testid="favorites-explore-cta"
      >
        {{ $t('favorites.exploreCta') }}
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

      <div
        v-if="variant === 'full' || variant === 'favorites'"
        class="col-span-full mt-2 flex flex-col items-center gap-3 py-2"
      >
        <FTLoadMoreSentinel
          v-if="isLoadingMore"
          loading
          :has-more="hasMore"
        />

        <UButton
          v-else-if="hasMore"
          color="neutral"
          variant="outline"
          class="rounded-full px-6"
          data-testid="trainer-list-load-more"
          @click="loadMore"
        >
          {{ $t('catalog.loadMore') }}
        </UButton>

        <p
          v-else
          class="text-sm text-slate-500"
          data-testid="trainer-list-end"
        >
          {{ $t('catalog.seenAll') }}
        </p>
      </div>
    </div>
  </div>
</template>
