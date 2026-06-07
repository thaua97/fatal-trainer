import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { ReportTrainerOption } from '~/composables/report/useReportTrainerSearch'
import { personalTrainersService } from '~/services/catalog/personal-trainers.service'

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
  const prefetchedTrainer = useState<PersonalTrainer | null>('trainer-select-prefetched', () => null)
  const prefetchPending = ref(false)

  async function prefetchTrainer(id: string): Promise<void> {
    if (!id) {
      prefetchedTrainer.value = null
      return
    }

    prefetchPending.value = true

    try {
      const response = await personalTrainersService.getById(id)
      prefetchedTrainer.value = response.trainer
    } catch {
      prefetchedTrainer.value = null
    } finally {
      prefetchPending.value = false
    }
  }

  watch(selectedId, (id) => {
    prefetchTrainer(id)
  }, { immediate: true })

  const items = computed<ReportTrainerOption[]>(() => {
    const list = [...trainerItems.value]

    const prefetched = prefetchedTrainer.value
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
    pending: computed(() => pending.value || prefetchPending.value),
    selectedAvatar,
  }
}
