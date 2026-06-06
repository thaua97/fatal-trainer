import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { MyTrainerResponse } from '#shared/types/api'

export function useMyTrainerProfile() {
  const trainer = useState<PersonalTrainer | null>('my-trainer-profile', () => null)

  const { data, pending, error, refresh } = useFetch<MyTrainerResponse>('/api/personal-trainers/me', {
    key: 'my-trainer-profile-fetch',
    onResponse({ response }) {
      if (response._data?.trainer) {
        trainer.value = response._data.trainer
      }
    },
  })

  watch(data, (value) => {
    if (value?.trainer) {
      trainer.value = value.trainer
    }
  })

  function setTrainer(next: PersonalTrainer) {
    trainer.value = next
    if (data.value) {
      data.value = { ...data.value, trainer: next }
    }

    const { setUserAvatarUrl } = useAuth()
    setUserAvatarUrl(next.photoUrl || undefined)
  }

  return {
    trainer: computed(() => trainer.value ?? data.value?.trainer ?? null),
    created: computed(() => data.value?.created ?? false),
    pending,
    error,
    refresh,
    setTrainer,
  }
}
