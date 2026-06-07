import type { Ref } from 'vue'

export function useFTFavoriteTrainer(trainerId: Ref<string> | string) {
  const id = computed(() => unref(trainerId))
  const { isFavorite, toggleFavorite, pending } = useTrainerBookmakers()

  const isFavorited = computed(() => isFavorite(id.value))

  async function toggle() {
    await toggleFavorite(id.value)
  }

  return {
    isFavorited,
    toggle,
    pending,
  }
}
