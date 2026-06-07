<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const { trainers, isLoading, shouldShow, sectionTitle } = useFTFeaturedTrainersCarousel()

const carouselRef = ref<{ emblaApi: { scrollTo: (index: number) => void } | null } | null>(null)
const activeIndex = ref(0)

function onCarouselSelect(index: number) {
  activeIndex.value = index
}

function onDotSelect(index: number) {
  carouselRef.value?.emblaApi?.scrollTo(index)
}

watch(trainers, () => {
  activeIndex.value = 0
})
</script>

<template>
  <div
    v-if="shouldShow"
    data-testid="featured-trainers-carousel"
  >
    <FTSectionHeading
      spacing="sm"
      class="mb-3"
      data-testid="featured-trainers-heading"
    >
      {{ sectionTitle }}
    </FTSectionHeading>

    <div
      v-if="isLoading"
      :class="[$style.cardGradient, 'relative aspect-4/5 max-h-[420px] w-full overflow-hidden rounded-3xl [&_.animate-pulse]:bg-white/25!']"
      aria-busy="true"
      :aria-label="sectionTitle"
      data-testid="featured-trainers-loading"
    >
      <div class="relative flex h-full flex-col justify-between p-6">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1 space-y-2">
            <USkeleton class="h-5 w-32 bg-white/25!" />
            <USkeleton class="h-4 w-24 bg-white/25!" />
          </div>
          <div class="flex gap-1.5">
            <USkeleton
              v-for="index in 6"
              :key="index"
              class="size-2.5 rounded-full bg-white/25!"
            />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <USkeleton class="size-8 rounded-full bg-white/25!" />
          <USkeleton class="size-8 rounded-full bg-white/25!" />
          <USkeleton class="h-8 w-16 bg-white/25!" />
        </div>
        <div class="flex items-end justify-between gap-4">
          <div class="flex-1 space-y-2">
            <USkeleton class="h-6 w-full bg-white/25!" />
            <USkeleton class="h-6 w-4/5 bg-white/25!" />
          </div>
          <USkeleton class="size-14 shrink-0 rounded-full bg-white/25!" />
        </div>
      </div>
    </div>

    <UCarousel
      v-else
      ref="carouselRef"
      v-slot="{ item }"
      :items="trainers as PersonalTrainer[]"
      class="w-full"
      :ui="{
        item: 'basis-full ps-0',
        container: 'ms-0',
      }"
      @select="onCarouselSelect"
    >
      <FTFeaturedTrainerCard
        :trainer="item"
        :active-index="activeIndex"
        :slide-count="trainers.length"
        @dot-select="onDotSelect"
      />
    </UCarousel>
  </div>
</template>

<style module>
.cardGradient {
  background: linear-gradient(135deg, rgb(var(--ft-primary-rgb) / 0.96) 0%, rgb(167 139 250 / 0.92) 42%, rgb(56 189 248 / 0.88) 100%);
}
</style>
