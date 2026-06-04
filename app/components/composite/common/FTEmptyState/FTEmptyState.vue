<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'search' | 'filters' | 'generic'
  title: string
  testId?: string
}>(), {
  variant: 'generic',
})

const icon = computed(() => {
  switch (props.variant) {
    case 'search': return 'i-lucide-search-x'
    case 'filters': return 'i-lucide-sliders-horizontal'
    default: return 'i-lucide-inbox'
  }
})
</script>

<template>
  <div
    class="flex flex-col items-center px-6 py-12 text-center"
    :data-testid="testId"
  >
    <UIcon
      :name="icon"
      class="size-12 text-slate-500"
    />
    <p class="mt-4 text-base font-semibold text-slate-900">
      {{ title }}
    </p>
    <div
      v-if="$slots.default"
      class="mt-6"
    >
      <slot />
    </div>
  </div>
</template>
