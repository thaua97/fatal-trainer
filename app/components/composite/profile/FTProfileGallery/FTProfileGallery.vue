<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const trainerRef = toRef(props, 'trainer')
const { images, trainerName, hasGallery } = useFTProfileGallery(trainerRef)
const { openAt } = useProfileGalleryViewer(trainerRef)
</script>

<template>
  <div
    v-if="hasGallery"
    class="grid grid-cols-2 gap-2 sm:grid-cols-3"
    data-testid="trainer-gallery"
  >
    <button
      v-for="(image, index) in images"
      :key="index"
      type="button"
      class="group relative cursor-pointer overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      :aria-label="$t('galleryViewer.viewPhoto', { index: index + 1, total: images.length, name: trainerName })"
      :data-testid="`gallery-thumb-${index}`"
      @click="openAt(index)"
    >
      <div class="transition-transform duration-300 group-hover:scale-[1.03]">
        <FTAvatar
          :src="image"
          :name="trainerName"
          size="fill"
        />
      </div>
    </button>
  </div>
</template>
