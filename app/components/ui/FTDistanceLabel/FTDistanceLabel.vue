<script setup lang="ts">
import { formatAdminLocation } from '#shared/utils/format-admin-user'

const props = defineProps<{
  city?: string
  state?: string
}>()

const label = computed(() =>
  formatAdminLocation({ city: props.city, state: props.state }),
)
</script>

<template>
  <span
    v-if="label"
    class="inline-flex items-center gap-1 text-xs text-slate-500"
  >
    <UIcon
      name="i-lucide-map-pin"
      class="size-3.5"
    />
    {{ label }}
  </span>
</template>
