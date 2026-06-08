<script setup lang="ts">
import type { TrainerModality } from '#shared/domain/catalog/entities/personal-trainer'
import { formatModalityLabels } from '#shared/utils/format-modality-labels'

const props = defineProps<{
  modality: TrainerModality
}>()

const { t } = useI18n()

const label = computed(() => formatModalityLabels([props.modality], t)[0] ?? props.modality)

const toneClass = computed(() => {
  const map: Record<TrainerModality, string> = {
    presencial: 'presencial',
    online: 'online',
    hibrido: 'hibrido',
  }
  return map[props.modality]
})
</script>

<template>
  <span
    :class="[$style.badge, $style[toneClass]]"
    data-testid="modality-badge"
  >
    {{ label }}
  </span>
</template>

<style module>
.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
}

.presencial {
  background: linear-gradient(
    135deg,
    rgb(var(--ft-admin-badge-trainer-from-rgb) / 0.95) 0%,
    rgb(var(--ft-admin-badge-trainer-to-rgb) / 0.75) 100%
  );
  color: var(--ft-admin-badge-trainer-text);
  border-color: rgb(var(--ft-admin-badge-trainer-from-rgb) / 0.35);
}

.online {
  background: linear-gradient(
    135deg,
    rgb(var(--ft-admin-badge-student-from-rgb) / 0.95) 0%,
    rgb(var(--ft-admin-badge-student-to-rgb) / 0.75) 100%
  );
  color: var(--ft-admin-badge-student-text);
  border-color: rgb(var(--ft-admin-badge-student-from-rgb) / 0.35);
}

.hibrido {
  background: linear-gradient(
    135deg,
    rgb(var(--ft-admin-badge-admin-from-rgb) / 0.95) 0%,
    rgb(var(--ft-admin-badge-admin-to-rgb) / 0.75) 100%
  );
  color: var(--ft-admin-badge-admin-text);
  border-color: rgb(var(--ft-admin-badge-admin-from-rgb) / 0.35);
}
</style>
