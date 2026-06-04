import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

export function useFTProfileGallery(trainer: Ref<PersonalTrainer | undefined | null>) {
  const images = computed(() => trainer.value?.gallery ?? [])
  const trainerName = computed(() => trainer.value?.name ?? '')

  return { images, trainerName, hasGallery: computed(() => images.value.length > 0) }
}
