<script setup lang="ts">
withDefaults(defineProps<{
  spacing?: 'sm' | 'md'
}>(), {
  spacing: 'md',
})
</script>

<template>
  <h2
    class="font-semibold text-slate-900"
    :class="spacing === 'sm' ? 'text-lg' : 'text-xl'"
  >
    <slot />
  </h2>
</template>
