<script setup lang="ts">
const props = defineProps<{
  total: number
  filtered?: number
  loading?: boolean
}>()

const { t, locale } = useI18n()

const label = computed(() => {
  if (props.loading) return t('results.loading')
  const count = props.filtered ?? props.total
  const suffix = count === 1 ? t('results.trainer') : t('results.trainers')
  if (props.filtered != null && props.filtered !== props.total) {
    return t('results.filtered', { count, total: props.total, suffix })
  }
  return `${count.toLocaleString(locale.value)} ${suffix}`
})
</script>

<template>
  <p class="text-sm text-slate-600">
    {{ label }}
  </p>
</template>
