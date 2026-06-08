<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const locationLabel = computed(() => {
  const parts: string[] = []
  if (props.trainer.city) parts.push(props.trainer.city)
  if (props.trainer.state) parts.push(props.trainer.state)
  return parts.join(', ')
})
</script>

<template>
  <FTProfileSection
    v-if="locationLabel"
    title="Detalhes da localização"
    test-id="trainer-location"
    :bordered="false"
  >
    <div class="min-w-0">
      <p class="truncate font-semibold text-slate-900">
        {{ trainer.profession }}
      </p>
      <p class="truncate text-sm text-slate-500">
        {{ locationLabel }}
      </p>
    </div>
  </FTProfileSection>
</template>
