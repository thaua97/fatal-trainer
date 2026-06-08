<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

defineEmits<{
  trainerUpdated: []
}>()

const trainerRef = toRef(props, 'trainer')
const { hasGallery } = useFTProfileGallery(trainerRef)
</script>

<template>
  <div>
    <FTProfileHero :trainer="trainer" />

    <FTProfileLocationRow :trainer="trainer" />

    <FTProfileSection :title="$t('profile.about')">
      <p class="text-sm leading-relaxed text-slate-600">
        {{ trainer.description }}
      </p>
    </FTProfileSection>

    <FTProfileSection
      v-if="trainer.specialties?.length"
      :title="$t('profile.specialties')"
    >
      <p class="text-sm text-slate-600">
        <template
          v-for="(specialty, index) in trainer.specialties"
          :key="specialty"
        >
          <span v-if="index > 0"> · </span>{{ specialty }}
        </template>
      </p>
    </FTProfileSection>

    <FTProfileSection
      v-if="trainer.cref"
      :title="$t('profile.certification')"
    >
      <p class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
        <UIcon name="i-lucide-shield-check" class="size-5 text-violet-600" />
        CREF {{ trainer.cref }}
      </p>
    </FTProfileSection>

    <FTProfileReviewSection
      :trainer="trainer"
      @trainer-updated="$emit('trainerUpdated')"
    />

    <FTProfileSection v-if="hasGallery">
      <FTProfileGallery :trainer="trainer" />
    </FTProfileSection>
  </div>
</template>
