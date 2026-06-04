import type { TrainerModality } from '#shared/domain/catalog/entities/personal-trainer'
import { formatModalityLabels } from '#shared/utils/format-modality-labels'

export interface FTFilterChip {
  key: string
  label: string
}

export function useFTActiveFilterChips() {
  const { t } = useI18n()
  const { filters, updateFilters } = useTrainerFilters()

  const chips = computed<FTFilterChip[]>(() => {
    const result: FTFilterChip[] = []
    const f = filters.value

    if (f.search) {
      result.push({ key: 'search', label: `«${f.search}»` })
    }
    f.specialties?.forEach((s) => {
      result.push({ key: `specialty-${s}`, label: s })
    })
    if (f.modalities?.length) {
      formatModalityLabels(f.modalities as TrainerModality[], t).forEach((label, i) => {
        const modality = f.modalities![i]
        if (modality) result.push({ key: `modality-${modality}`, label })
      })
    }
    if (f.minPrice != null || f.maxPrice != null) {
      const min = f.minPrice ?? 0
      const max = f.maxPrice ?? '∞'
      result.push({ key: 'price', label: `R$ ${min}–${max}` })
    }
    if (f.minRating != null) {
      result.push({ key: 'rating', label: `≥ ${f.minRating}` })
    }
    if (f.city) {
      result.push({ key: 'city', label: f.city })
    }

    return result
  })

  function dismissChip(chip: FTFilterChip) {
    if (chip.key === 'search') {
      updateFilters({ search: undefined, page: 1 })
      return
    }
    if (chip.key.startsWith('specialty-')) {
      const name = chip.label
      updateFilters({
        specialties: filters.value.specialties?.filter(s => s !== name),
        page: 1,
      })
      return
    }
    if (chip.key.startsWith('modality-')) {
      const modality = chip.key.replace('modality-', '')
      updateFilters({
        modalities: filters.value.modalities?.filter(m => m !== modality),
        page: 1,
      })
      return
    }
    if (chip.key === 'price') {
      updateFilters({ minPrice: undefined, maxPrice: undefined, page: 1 })
      return
    }
    if (chip.key === 'rating') {
      updateFilters({ minRating: undefined, page: 1 })
      return
    }
    if (chip.key === 'city') {
      updateFilters({ city: undefined, page: 1 })
    }
  }

  return { chips, dismissChip }
}
