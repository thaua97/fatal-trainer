<script setup lang="ts">
import { getPromotionTemplateStatus } from '#shared/utils/promotion-template-status'

const props = defineProps<{
  isActive: boolean
  startsAt: string
  endsAt: string
}>()

const meta = computed(() => getPromotionTemplateStatus(props))
</script>

<template>
  <UBadge
    :color="meta.color"
    variant="soft"
    size="sm"
  >
    {{ meta.label }}
  </UBadge>
</template>
