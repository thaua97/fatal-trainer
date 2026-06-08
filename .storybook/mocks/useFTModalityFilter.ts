import { computed } from 'vue'
import type { TrainerModality } from '../../shared/domain/catalog/entities/personal-trainer'
import { CATALOG_MODALITIES } from '../../shared/domain/catalog/constants/catalog-options'
import { storyFiltersComputed, storyUpdateFilters } from './catalog-filter-state'

export function useFTModalityFilter() {
  const options = computed(() =>
    CATALOG_MODALITIES.map((modality) => ({
      value: modality,
      label: modality === 'presencial' ? 'Presencial' : modality === 'online' ? 'Online' : 'Híbrido',
    })),
  )

  const selected = computed(() => storyFiltersComputed.value.modalities ?? [])

  function isSelected(modality: TrainerModality) {
    return selected.value.includes(modality)
  }

  function toggle(modality: TrainerModality) {
    const current = selected.value
    const next = current.includes(modality)
      ? current.filter((item) => item !== modality)
      : [...current, modality]

    storyUpdateFilters({
      modalities: next.length ? next : undefined,
      page: 1,
    })
  }

  return { options, selected, isSelected, toggle }
}
