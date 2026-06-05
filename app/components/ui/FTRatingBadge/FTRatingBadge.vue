<script setup lang="ts">
const props = defineProps<{
  rating: number
  reviewCount?: number
}>()

const { locale } = useI18n()

const label = computed(() => {
  const rating = props.rating.toLocaleString(locale.value, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  if (props.reviewCount != null) {
    return `${rating} (${props.reviewCount.toLocaleString(locale.value)})`
  }
  return rating
})
</script>

<template>
  <span class="inline-flex items-center gap-1 text-sm font-medium text-slate-900 lg:text-base">
    <UIcon
      name="i-lucide-star"
      class="size-3.5 text-amber-400 lg:size-4"
    />
    {{ label }}
  </span>
</template>
