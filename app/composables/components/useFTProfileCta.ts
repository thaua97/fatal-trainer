export function useFTProfileCta() {
  const { t } = useI18n()
  const label = computed(() => t('profile.hireTrainer'))
  const disabled = true

  return { label, disabled }
}
