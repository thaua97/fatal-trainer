export function useFTInputMask(
  modelValue: Ref<string>,
  formatter: (value: string) => string,
  emit: (value: string) => void,
) {
  const displayValue = ref(formatter(modelValue.value))

  watch(modelValue, (value) => {
    const formatted = formatter(value)
    if (formatted !== displayValue.value) {
      displayValue.value = formatted
    }
  })

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    const formatted = formatter(target.value)
    displayValue.value = formatted
    emit(formatted)
  }

  return {
    displayValue,
    handleInput,
  }
}
