<script setup lang="ts">
defineProps<{
  count: number
  activeIndex: number
}>()

const emit = defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <div
    class="flex items-center gap-1.5"
    role="tablist"
    aria-label="Slides do carrossel"
    data-testid="carousel-dots"
  >
    <button
      v-for="index in count"
      :key="index - 1"
      type="button"
      role="tab"
      class="flex size-2.5 items-center justify-center rounded-full transition-colors"
      :class="activeIndex === index - 1
        ? 'size-3.5 border border-white bg-transparent'
        : 'bg-white/35 hover:bg-white/50'"
      :aria-selected="activeIndex === index - 1"
      :aria-label="`Ir para slide ${index}`"
      @click="emit('select', index - 1)"
    >
      <span
        v-if="activeIndex === index - 1"
        class="size-1.5 rounded-full bg-white"
      />
    </button>
  </div>
</template>
