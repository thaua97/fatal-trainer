import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { UpdateTrainerProfileRequest } from '#shared/types/api'
import { parseApiError } from '~/services/api/extract-api-errors'
import { trainerProfileService } from '~/services/dashboard/trainer-profile.service'

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
      const response = await trainerProfileService.update(payload)
      success.value = true
      return response.trainer
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'dashboard.info.errors.submitFailed')
      fieldErrors.value = parsed.fieldErrors
      error.value = parsed.message
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
