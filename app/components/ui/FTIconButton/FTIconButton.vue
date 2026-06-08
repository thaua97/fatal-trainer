<script setup lang="ts">
import { useCssModule } from 'vue'

export type FTIconButtonVariant = 'neutral' | 'whatsapp' | 'favorite' | 'report'

const props = withDefaults(defineProps<{
  to?: string
  ariaLabel?: string
  size?: 'sm' | 'md'
  disabled?: boolean
  variant?: FTIconButtonVariant
  active?: boolean
}>(), {
  to: undefined,
  ariaLabel: undefined,
  size: 'md',
  disabled: false,
  variant: 'neutral',
  active: false,
})

defineEmits<{
  click: []
}>()

const style = useCssModule()

const sizeClass = computed(() => (props.size === 'sm' ? 'size-10' : 'size-11'))

const variantClass = computed(() => {
  if (props.variant === 'whatsapp') {
    return style.whatsapp
  }
  if (props.variant === 'favorite') {
    return props.active ? style.favoriteActive : style.favorite
  }
  if (props.variant === 'report') {
    return style.report
  }
  return style.neutral
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[$style.iconSurface, variantClass, sizeClass]"
    :aria-label="ariaLabel"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    type="button"
    :class="[$style.iconSurface, variantClass, sizeClass, disabled && $style.disabled]"
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
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgb(15 23 42 / 0.06);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

.iconSurface:hover:not(.disabled) {
  box-shadow: 0 2px 8px rgb(15 23 42 / 0.1);
  transform: translateY(-1px);
}

.iconSurface:active:not(.disabled) {
  transform: translateY(0);
}

.neutral {
  background: #fff;
  border: 1px solid rgb(226 232 240);
}

.whatsapp {
  background: var(--ft-action-whatsapp-subtle);
  border: 1px solid var(--ft-action-whatsapp-border);
  color: var(--ft-action-whatsapp);
}

.favorite {
  background: var(--ft-action-favorite-subtle);
  border: 1px solid var(--ft-action-favorite-border);
  color: var(--ft-action-favorite);
}

.favoriteActive {
  background: var(--ft-action-favorite-active-subtle);
  border: 1px solid var(--ft-action-favorite-active-border);
  color: var(--ft-action-favorite-active);
}

.report {
  background: var(--ft-action-report-subtle);
  border: 1px solid var(--ft-action-report-border);
  color: var(--ft-action-report);
}

.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.disabled:hover {
  box-shadow: 0 1px 3px rgb(15 23 42 / 0.06);
  transform: none;
}
</style>
