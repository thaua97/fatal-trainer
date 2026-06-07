<script setup lang="ts">
const props = withDefaults(defineProps<{
  to?: string
  ariaLabel: string
  size?: 'sm' | 'md'
  disabled?: boolean
}>(), {
  size: 'md',
  disabled: false,
})

defineEmits<{
  click: []
}>()

const sizeClass = computed(() => (props.size === 'sm' ? 'size-10' : 'size-11'))
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[$style.iconSurface, sizeClass]"
    :aria-label="ariaLabel"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    type="button"
    :class="[$style.iconSurface, sizeClass, disabled && $style.disabled]"
    :aria-label="ariaLabel"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style module>
.iconSurface {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid rgb(226 232 240);
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgb(15 23 42 / 0.06);
  transition: box-shadow 0.15s ease;
}

.iconSurface:hover {
  box-shadow: 0 2px 8px rgb(15 23 42 / 0.1);
}

.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.disabled:hover {
  box-shadow: 0 1px 3px rgb(15 23 42 / 0.06);
}
</style>
