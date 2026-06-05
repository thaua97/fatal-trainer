<script setup lang="ts">
withDefaults(defineProps<{
  badgeCount?: number
}>(), {
  badgeCount: 0,
})

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    :class="[$style.fab, 'fixed bottom-6 left-1/2 z-40 inline-flex -translate-x-1/2 items-center justify-center gap-2 lg:hidden']"
    data-testid="filter-fab"
    @click="$emit('click')"
  >
    <UIcon name="i-lucide-sliders-horizontal" class="size-5" />
    {{ $t('catalog.filters') }}
    <span
      v-if="badgeCount > 0"
      :class="$style.badge"
      data-testid="filter-fab-badge"
    >
      {{ badgeCount }}
    </span>
  </button>
</template>

<style module>
.fab {
  border-radius: 9999px;
  background: var(--ft-primary);
  padding: 0.875rem 1.75rem;
  font-weight: 700;
  color: var(--ft-primary-foreground);
  box-shadow: 0 4px 16px rgb(var(--ft-primary-rgb) / 0.35);
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
}

.fab:hover {
  background: var(--ft-primary-hover);
  box-shadow: 0 6px 20px rgb(var(--ft-primary-rgb) / 0.45);
}

.badge {
  display: inline-flex;
  min-width: 1.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #fff;
  padding: 0.125rem 0.375rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--ft-primary);
}
</style>
