import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { trainerProfileService } from '~/services/dashboard/trainer-profile.service'

export function useMyTrainerProfile() {
  const { setUserAvatarUrl } = useAuth()

  const { data, pending, error, refresh } = useAsyncData(
    'my-trainer-profile-response',
    () => trainerProfileService.getMe(),
    { server: false },
  )

  const trainer = computed(() => data.value?.trainer ?? null)
  const created = computed(() => data.value?.created ?? false)

  function setTrainer(next: PersonalTrainer) {
    if (data.value) {
      data.value = { ...data.value, trainer: next }
    } else {
      data.value = { trainer: next, created: true }
    }
    setUserAvatarUrl(next.photoUrl || undefined)
  }

  return {
    trainer,
    created,
    pending,
    error,
    refresh,
    setTrainer,
  }
}
