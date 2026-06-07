import { ref } from 'vue'

export function useCatalogCityGate() {
  const modalOpen = ref(false)

  return {
    fetchEnabled: ref(true),
    modalOpen,
    isAwaitingCity: ref(false),
    resolveWithAll: () => {
      modalOpen.value = false
    },
    openModal: () => {
      modalOpen.value = true
    },
  }
}
