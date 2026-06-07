import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { trainerProfileService } from '~/services/dashboard/trainer-profile.service'

export function useMyTrainerProfile() {
  const trainer = useState<PersonalTrainer | null>('my-trainer-profile', () => null)
  const created = useState('my-trainer-profile-created', () => false)
  const pending = useState('my-trainer-profile-pending', () => false)
  const error = useState<Error | null>('my-trainer-profile-error', () => null)
  const hydrated = useState('my-trainer-profile-hydrated', () => false)

  async function fetchMyProfile(): Promise<void> {
    pending.value = true
    error.value = null

    try {
      const response = await trainerProfileService.getMe()
      trainer.value = response.trainer
      created.value = response.created
      hydrated.value = true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err : new Error('fetchFailed')
    } finally {
      pending.value = false
    }
  }

  if (!hydrated.value && !pending.value) {
    fetchMyProfile()
  }

  function setTrainer(next: PersonalTrainer) {
    trainer.value = next

    const { setUserAvatarUrl } = useAuth()
    setUserAvatarUrl(next.photoUrl || undefined)
  }

  return {
    trainer: computed(() => trainer.value),
    created: computed(() => created.value),
    pending,
    error,
    refresh: fetchMyProfile,
    setTrainer,
  }
}
