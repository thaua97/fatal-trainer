export function useFTCityPickerMenu(options: {
  disabled: Ref<boolean>
  isEditing: Ref<boolean>
  syncSearchTermFromSelection: () => void
}) {
  const menuOpen = ref(false)
  const inputMenuRef = ref<{ $el: HTMLElement } | null>(null)

  function focusInputMenu() {
    nextTick(() => {
      const root = inputMenuRef.value?.$el
      if (root && typeof root.querySelector === 'function') {
        root.querySelector('input')?.focus()
      }
    })
  }

  function startEditing() {
    if (options.disabled.value) {
      return
    }

    options.isEditing.value = true
    menuOpen.value = true
    options.syncSearchTermFromSelection()
    focusInputMenu()
  }

  function stopEditing() {
    options.isEditing.value = false
    menuOpen.value = false
    options.syncSearchTermFromSelection()
  }

  function onMenuOpenChange(open: boolean) {
    menuOpen.value = open

    if (!open) {
      window.setTimeout(() => {
        if (!menuOpen.value) {
          stopEditing()
        }
      }, 150)
    }
  }

  return {
    menuOpen,
    inputMenuRef,
    startEditing,
    stopEditing,
    onMenuOpenChange,
  }
}
