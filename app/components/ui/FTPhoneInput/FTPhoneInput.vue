<script setup lang="ts">
import { formatBrazilianPhone } from '#shared/utils/format-brazilian-phone'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  testId?: string
  disabled?: boolean
}>(), {
  testId: 'phone-input',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { fieldUi, inputSize } = useFTFormFieldUi()
const modelValueRef = toRef(props, 'modelValue')

const { displayValue, handleInput } = useFTInputMask(
  modelValueRef,
  formatBrazilianPhone,
  (value: string) => emit('update:modelValue', value),
)
</script>

<template>
  <UInput
    :model-value="displayValue"
    class="w-full"
    type="tel"
    inputmode="numeric"
    autocomplete="tel"
    :placeholder="placeholder"
    :disabled="disabled"
    :ui="fieldUi"
    :size="inputSize"
    :data-testid="testId"
    @input="handleInput"
  />
</template>
