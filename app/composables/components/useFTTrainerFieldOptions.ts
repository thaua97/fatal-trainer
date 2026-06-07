import { CATALOG_MODALITIES, CATALOG_SPECIALTIES } from '#shared/domain/catalog/constants/catalog-options'

export function useFTTrainerFieldOptions() {
  const { t } = useI18n()

  const specialtyItems = computed(() =>
    CATALOG_SPECIALTIES.map(value => ({ label: value, value })),
  )

  const modalityItems = computed(() =>
    CATALOG_MODALITIES.map(value => ({
      label: t(`modality.${value}`),
      value,
    })),
  )

  return {
    specialtyItems,
    modalityItems,
  }
}
