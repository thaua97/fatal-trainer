import type { TrainerModality } from '#shared/domain/catalog/entities/personal-trainer'
import { CATALOG_MODALITIES } from '#shared/domain/catalog/constants/catalog-options'

export function useFTModalityFilter() {
  const { t } = useI18n()
  const { filters, updateFilters } = useTrainerFilters()

  const options = computed(() =>
    CATALOG_MODALITIES.map((modality) => ({
      value: modality,
      label: t(`modality.${modality}`),
    })),
  )

  const selected = computed(() => filters.value.modalities ?? [])

  function isSelected(modality: TrainerModality) {
    return selected.value.includes(modality)
  }

  function toggle(modality: TrainerModality) {
    const current = selected.value
    const next = current.includes(modality)
      ? current.filter((item) => item !== modality)
      : [...current, modality]

    updateFilters({
      modalities: next.length ? next : undefined,
      page: 1,
    })
  }

  return {
    options,
    selected,
    isSelected,
    toggle,
  }
}
