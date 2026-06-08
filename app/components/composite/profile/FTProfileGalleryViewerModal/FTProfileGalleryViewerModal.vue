<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const trainerRef = toRef(props, 'trainer')
const { t } = useI18n()

const {
  viewerOpen,
  activeIndex,
  images,
  trainerName,
  total,
  canGoPrev,
  canGoNext,
  hasMultipleImages,
  goNext,
  goPrev,
  handleKeydown,
} = useProfileGalleryViewer(trainerRef)

const carouselRef = ref<{ emblaApi: { scrollTo: (index: number) => void } | null } | null>(null)

function scrollToActiveIndex() {
  nextTick(() => {
    carouselRef.value?.emblaApi?.scrollTo(activeIndex.value)
  })
}

watch(activeIndex, () => {
  if (viewerOpen.value) {
    scrollToActiveIndex()
  }
})

function onCarouselSelect(index: number) {
  if (index !== activeIndex.value) {
    activeIndex.value = index
  }
}

function onModalAfterEnter() {
  scrollToActiveIndex()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <FTModal
    v-model:open="viewerOpen"
    variant="media"
    :title="trainerName"
    title-id="gallery-viewer-modal-title"
    test-id="gallery-viewer-modal"
    @after:enter="onModalAfterEnter"
  >
    <div
      class="relative flex h-full min-h-full flex-1 flex-col"
      data-testid="gallery-viewer-content"
    >
      <UCarousel
        v-if="viewerOpen"
        ref="carouselRef"
        v-slot="{ item, index }"
        :items="images"
        :start-index="activeIndex"
        class="flex h-full w-full flex-1"
        :ui="{
          item: 'basis-full h-full ps-0',
          container: 'ms-0 h-full',
          viewport: 'h-full',
        }"
        @select="onCarouselSelect"
      >
        <figure class="m-0 flex h-full w-full items-center justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(3.5rem,env(safe-area-inset-top))]">
          <img
            :src="item"
            :alt="t('galleryViewer.photoOf', { index: index + 1, total, name: trainerName })"
            class="max-h-full max-w-full object-contain transition-opacity duration-300"
            data-testid="gallery-viewer-image"
          >
          <figcaption class="sr-only">
            {{ t('galleryViewer.photoOf', { index: index + 1, total, name: trainerName }) }}
          </figcaption>
        </figure>
      </UCarousel>

      <FTIconButton
        v-if="hasMultipleImages && canGoPrev"
        size="md"
        variant="neutral"
        class="absolute start-[max(0.75rem,env(safe-area-inset-left))] top-1/2 z-10 -translate-y-1/2 border-white/20! bg-white/10! text-white! shadow-none backdrop-blur-sm hover:bg-white/20!"
        :aria-label="t('galleryViewer.prev')"
        data-testid="gallery-viewer-prev"
        @click="goPrev"
      >
        <UIcon
          name="i-lucide-chevron-left"
          class="size-5"
        />
      </FTIconButton>

      <FTIconButton
        v-if="hasMultipleImages && canGoNext"
        size="md"
        variant="neutral"
        class="absolute end-[max(0.75rem,env(safe-area-inset-right))] top-1/2 z-10 -translate-y-1/2 border-white/20! bg-white/10! text-white! shadow-none backdrop-blur-sm hover:bg-white/20!"
        :aria-label="t('galleryViewer.next')"
        data-testid="gallery-viewer-next"
        @click="goNext"
      >
        <UIcon
          name="i-lucide-chevron-right"
          class="size-5"
        />
      </FTIconButton>

      <p
        v-if="hasMultipleImages"
        class="pointer-events-none absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-sm font-medium tracking-wide text-white/80"
        aria-live="polite"
        data-testid="gallery-viewer-counter"
      >
        {{ t('galleryViewer.counter', { current: activeIndex + 1, total }) }}
      </p>
    </div>
  </FTModal>
</template>
