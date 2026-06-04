<script setup lang="ts">
import type { TrainerModality } from '#shared/domain/catalog/entities/personal-trainer'
import { formatModalityLabels } from '#shared/utils/format-modality-labels'

const props = defineProps<{
  modality: TrainerModality
}>()

const { t } = useI18n()

const label = computed(() => formatModalityLabels([props.modality], t)[0] ?? props.modality)
</script>

<template>
  <UBadge
    color="neutral"
    variant="subtle"
    size="sm"
    class="rounded-full"
  >
    {{ label }}
  </UBadge>
</template>
