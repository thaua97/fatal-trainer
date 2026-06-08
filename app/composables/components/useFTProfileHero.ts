import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { formatModalityLabels } from '#shared/utils/format-modality-labels'

export function useFTProfileHero(trainer: Ref<PersonalTrainer | undefined | null>) {
  const { t } = useI18n()

  const modalityLine = computed(() =>
    formatModalityLabels(trainer.value?.modalities, t).join('/'),
  )

  const specialtyLine = computed(() => {
    const current = trainer.value
    const specialty = current?.specialties?.[0]
    if (modalityLine.value && specialty) return `${modalityLine.value} • ${specialty}`
    return modalityLine.value || specialty || ''
  })

  const carouselCount = computed(() => {
    const gallery = trainer.value?.gallery?.length ?? 0
    return gallery > 0 ? gallery : 1
  })

  return { modalityLine, specialtyLine, carouselCount }
}
