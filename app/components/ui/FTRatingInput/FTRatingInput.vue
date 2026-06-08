<script setup lang="ts">
const rating = defineModel<number>({ default: 0 })

const props = withDefaults(defineProps<{
  readonly?: boolean
  size?: 'sm' | 'md'
}>(), {
  readonly: false,
  size: 'md',
})

const hoverRating = ref<number | null>(null)

const displayRating = computed(() => hoverRating.value ?? rating.value)

const iconSize = computed(() => (props.size === 'sm' ? 'size-4' : 'size-5'))

function setRating(value: number) {
  if (props.readonly) {
    return
  }
  rating.value = value
}

function handleSelect(starIndex: number, half: 'left' | 'right') {
  const value = half === 'left' ? starIndex - 0.5 : starIndex
  setRating(value)
}

function handleHover(starIndex: number, half: 'left' | 'right') {
  if (props.readonly) {
    return
  }
  hoverRating.value = half === 'left' ? starIndex - 0.5 : starIndex
}

function clearHover() {
  hoverRating.value = null
}

function fillAmount(starIndex: number): number {
  const value = displayRating.value
  if (value >= starIndex) {
    return 1
  }
  if (value >= starIndex - 0.5) {
    return 0.5
  }
  return 0
}
</script>

<template>
  <div
    class="inline-flex items-center gap-1"
    role="slider"
    :aria-valuenow="rating"
    aria-valuemin="0.5"
    aria-valuemax="5"
    aria-label="Rating"
    data-testid="rating-input"
    @mouseleave="clearHover"
  >
    <div
      v-for="starIndex in 5"
      :key="starIndex"
      class="relative"
      :class="iconSize"
    >
      <UIcon
        name="i-lucide-star"
        class="text-slate-200"
        :class="iconSize"
      />

      <div
        class="absolute inset-0 overflow-hidden text-amber-400"
        :style="{ width: `${fillAmount(starIndex) * 100}%` }"
      >
        <UIcon
          name="i-lucide-star"
          class="fill-current"
          :class="iconSize"
        />
      </div>

      <template v-if="!readonly">
        <button
          type="button"
          class="absolute inset-y-0 left-0 w-1/2 cursor-pointer opacity-0"
          :aria-label="`${starIndex - 0.5} stars`"
          :data-testid="`rating-star-${starIndex}-left`"
          @click="handleSelect(starIndex, 'left')"
          @mouseenter="handleHover(starIndex, 'left')"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 w-1/2 cursor-pointer opacity-0"
          :aria-label="`${starIndex} stars`"
          :data-testid="`rating-star-${starIndex}-right`"
          @click="handleSelect(starIndex, 'right')"
          @mouseenter="handleHover(starIndex, 'right')"
        />
      </template>
    </div>

    <span
      v-if="displayRating > 0"
      class="ml-1 text-sm font-medium tabular-nums text-slate-700"
      data-testid="rating-input-value"
    >
      {{ displayRating.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) }}
    </span>
  </div>
</template>
