<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  percent?: number | null
  size?: 'sm' | 'md'
}>(), {
  size: 'md',
  label: undefined,
  percent: undefined,
})

const displayLabel = computed(() => {
  if (props.label) {
    return props.label
  }

  if (props.percent != null && props.percent > 0) {
    return `-${props.percent}%`
  }

  return null
})
</script>

<template>
  <span
    v-if="displayLabel"
    :class="[
      $style.badge,
      size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
    ]"
    data-testid="promo-badge"
  >
    {{ displayLabel }}
  </span>
</template>

<style module>
.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  background: rgb(var(--ft-promo-rgb) / 0.14);
  font-weight: 700;
  color: var(--ft-promo-strong);
  letter-spacing: 0.02em;
}
</style>
