import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { UpdateTrainerProfileRequest } from '#shared/types/api'

export function useUpdateTrainerProfile() {
  const pending = ref(false)
  const error = ref<string | null>(null)
  const fieldErrors = ref<Record<string, string>>({})
  const success = ref(false)

  async function update(payload: UpdateTrainerProfileRequest): Promise<PersonalTrainer | null> {
    pending.value = true
    error.value = null
    fieldErrors.value = {}
    success.value = false

    try {
      const response = await $fetch<{ trainer: PersonalTrainer }>('/api/personal-trainers/me', {
        method: 'PATCH',
        body: payload,
      })
      success.value = true
      return response.trainer
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const data = (err as { data?: { message?: string, errors?: Record<string, string> } }).data
        if (data?.errors) {
          fieldErrors.value = data.errors
        }
        error.value = data?.message ?? 'submitFailed'
      } else {
        error.value = 'submitFailed'
      }
      return null
    } finally {
      pending.value = false
    }
  }

  function resetStatus() {
    error.value = null
    fieldErrors.value = {}
    success.value = false
  }

  return {
    pending,
    error,
    fieldErrors,
    success,
    update,
    resetStatus,
  }
}
