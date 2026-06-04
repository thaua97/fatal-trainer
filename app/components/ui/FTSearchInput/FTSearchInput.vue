<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  debounceMs?: number
  testId?: string
}>(), {
  debounceMs: 200,
  testId: 'trainer-search',
})

const { t } = useI18n()

const placeholderText = computed(() => props.placeholder ?? t('catalog.searchPlaceholder'))

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (value) => {
  localValue.value = value
})

const debouncedEmit = useDebounceFn((value: string) => {
  emit('update:modelValue', value)
}, props.debounceMs)

watch(localValue, (value) => {
  debouncedEmit(value)
})

function clear() {
  localValue.value = ''
  emit('update:modelValue', '')
}

const styles = useCssModule() as Record<'searchPill', string>

const searchUi = computed(() => ({
  root: styles.searchPill,
  base: `${styles.searchPill} border-0 ring-0 text-(--ft-primary) placeholder:text-[rgb(var(--ft-primary-rgb)/0.45)] caret-(--ft-primary)`,
  leadingIcon: 'text-(--ft-primary)',
}))
</script>

<template>
  <UFormField
    class="w-full"
  >
    <UInput
      v-model="localValue"
      :data-testid="testId"
      :placeholder="placeholderText"
      icon="i-lucide-search"
      :aria-label="$t('catalog.searchAriaLabel')"
      :ui="searchUi"
      size="lg"
      class="w-full"
    >
      <template
        v-if="localValue"
        #trailing
      >
        <button
          type="button"
          class="flex size-11 items-center justify-center text-(--ft-primary) opacity-60 hover:opacity-100"
          :aria-label="$t('catalog.clearSearch')"
          @click="clear"
        >
          <UIcon name="i-lucide-x" class="size-4" />
        </button>
      </template>
    </UInput>
  </UFormField>
</template>

<style module>
.searchPill {
  background: var(--ft-surface-search);
  border-radius: 9999px;
  color: var(--ft-primary);
  caret-color: var(--ft-primary);
}

.searchPill::placeholder {
  color: rgb(var(--ft-primary-rgb) / 0.45);
}
</style>
