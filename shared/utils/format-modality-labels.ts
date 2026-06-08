import type { TrainerModality } from '#shared/domain/catalog/entities/personal-trainer'

const MODALITY_KEYS: Record<TrainerModality, string> = {
  presencial: 'modality.presencial',
  online: 'modality.online',
  hibrido: 'modality.hibrido',
}

export function formatModalityLabels(
  modalities: TrainerModality[] | undefined,
  t: (key: string) => string,
): string[] {
  if (!modalities?.length) return []
  return modalities.map(modality => t(MODALITY_KEYS[modality]))
}
