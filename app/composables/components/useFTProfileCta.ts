import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

export function useFTProfileCta(trainer: Ref<PersonalTrainer>) {
  const { t } = useI18n()
  const { openModal, canHire, hireUnavailableReason } = useProfileHireModal(trainer)

  const label = computed(() => t('profile.hireTrainer'))

  return { label, openModal, canHire, hireUnavailableReason }
}
