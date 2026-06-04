<script setup lang="ts">
const { trainers, isLoading, isEmpty, clearFilters } = useFTTrainerList()

const SKELETON_COUNT = 6
</script>

<template>
  <div>
    <div
      v-if="isLoading"
      class="flex flex-col"
      data-testid="trainer-list-loading"
      aria-busy="true"
      :aria-label="$t('catalog.loadingTrainers')"
    >
      <FTTrainerCardSkeleton
        v-for="index in SKELETON_COUNT"
        :key="index"
      />
    </div>

    <FTEmptyState
      v-else-if="isEmpty"
      variant="search"
      :title="$t('catalog.noTrainersFound')"
      test-id="trainer-list-empty"
    >
      <UButton
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
      class="flex flex-col pb-24 lg:pb-0"
      data-testid="trainer-list"
    >
      <FTTrainerCard
        v-for="trainer in trainers"
        :key="trainer.id"
        :trainer="trainer"
      />
    </div>
  </div>
</template>
