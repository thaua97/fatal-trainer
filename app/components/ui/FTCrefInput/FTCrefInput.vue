<script setup lang="ts">
import { formatCref } from '#shared/utils/format-cref'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  testId?: string
  disabled?: boolean
}>(), {
  testId: 'cref-input',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { fieldUi, inputSize } = useFTFormFieldUi()
const modelValueRef = toRef(props, 'modelValue')

const { displayValue, handleInput } = useFTInputMask(
  modelValueRef,
  formatCref,
  (value: string) => emit('update:modelValue', value),
)
</script>

<template>
  <UInput
    :model-value="displayValue"
    class="w-full"
    type="text"
    inputmode="text"
    autocapitalize="characters"
    :placeholder="placeholder"
    :disabled="disabled"
    :ui="fieldUi"
    :size="inputSize"
    :data-testid="testId"
    @input="handleInput"
  />
</template>
