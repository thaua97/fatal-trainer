import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { TrainerDetailResponse } from '#shared/types/api'
import type { ReportTrainerOption } from '~/composables/report/useReportTrainerSearch'

function mapTrainerToOption(trainer: PersonalTrainer): ReportTrainerOption {
  return {
    label: trainer.name,
    value: trainer.id,
    avatar: {
      src: trainer.photoUrl,
      alt: trainer.name,
    },
    profession: trainer.profession,
  }
}

export function useFTTrainerSelectMenu(modelValue: Ref<string>) {
  const { trainerItems, pending, search } = useReportTrainerSearch()

  const selectedId = computed(() => modelValue.value.trim())

  const prefetchUrl = computed(() =>
    selectedId.value ? `/api/personal-trainers/${selectedId.value}` : undefined,
  )

  const { data: prefetchedTrainer } = useFetch<TrainerDetailResponse>(
    prefetchUrl,
    {
      watch: [prefetchUrl],
    },
  )

  const items = computed<ReportTrainerOption[]>(() => {
    const list = [...trainerItems.value]

    const prefetched = prefetchedTrainer.value?.trainer
    if (prefetched && !list.some((item) => item.value === prefetched.id)) {
      list.unshift(mapTrainerToOption(prefetched))
    }

    return list
  })

  const selectedItem = computed(() =>
    items.value.find((item) => item.value === selectedId.value),
  )

  const selectedAvatar = computed(() => selectedItem.value?.avatar)

  return {
    search,
    items,
    pending,
    selectedAvatar,
  }
}
