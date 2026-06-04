<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const trainerRef = toRef(props, 'trainer')
const { images, trainerName, hasGallery } = useFTProfileGallery(trainerRef)
</script>

<template>
  <div
    v-if="hasGallery"
    class="grid grid-cols-2 gap-2 sm:grid-cols-3"
    data-testid="trainer-gallery"
  >
    <FTAvatar
      v-for="(image, index) in images"
      :key="index"
      :src="image"
      :name="trainerName"
      size="fill"
    />
  </div>
</template>
