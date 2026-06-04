<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const thumbnailUrl = computed(() =>
  props.trainer.gallery?.[0] ?? props.trainer.photoUrl,
)

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
    <div class="flex items-center gap-3">
      <FTAvatar
        :src="thumbnailUrl"
        :name="trainer.name"
        size="xs"
      />
      <div class="min-w-0 flex-1">
        <p class="truncate font-semibold text-slate-900">
          {{ trainer.profession }}
        </p>
        <p class="truncate text-sm text-slate-500">
          {{ locationLabel }}
        </p>
      </div>
      <FTIconButton
        size="sm"
        class="shrink-0"
        ariaLabel="Mais informações sobre a localização"
      >
        <UIcon name="i-lucide-info" class="size-4 text-slate-600" />
      </FTIconButton>
    </div>
  </FTProfileSection>
</template>
