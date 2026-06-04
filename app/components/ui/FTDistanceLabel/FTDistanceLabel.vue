<script setup lang="ts">
const props = defineProps<{
  distanceKm: number
}>()

const { locale } = useI18n()

const label = computed(() =>
  `${props.distanceKm.toLocaleString(locale.value, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`,
)
</script>

<template>
  <span class="inline-flex items-center gap-1 text-xs text-slate-500">
    <UIcon
      name="i-lucide-map-pin"
      class="size-3.5"
    />
    {{ label }}
  </span>
</template>
