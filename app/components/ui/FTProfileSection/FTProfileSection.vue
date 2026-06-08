<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  testId?: string
  bordered?: boolean
}>(), {
  bordered: true,
  title: undefined,
  testId: undefined,
})
</script>

<template>
  <section
    class="px-5 py-6 lg:px-0"
    :class="bordered ? 'border-b border-slate-100' : ''"
    :data-testid="testId"
  >
    <h2
      v-if="title"
      class="mb-3 text-lg font-semibold text-slate-900"
    >
      {{ title }}
    </h2>
    <slot />
  </section>
</template>
