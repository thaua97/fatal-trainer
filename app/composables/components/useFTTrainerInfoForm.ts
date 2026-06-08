import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { TrainerInfoPayload, TrainerInfoValidationErrors } from '#shared/domain/catalog/entities/trainer-profile-payloads'
import { validateTrainerInfo } from '#shared/domain/catalog/services/validate-trainer-profile'
import type { UpdateTrainerProfileRequest } from '#shared/types/api'
import { applyApiError } from '~/composables/core/applyApiError'
import { useFieldErrorTranslator } from '~/composables/core/useFieldErrorTranslator'

function emptyForm(): TrainerInfoPayload {
  return {
    name: '',
    contactPhone: '',
    profession: '',
    description: '',
    specialties: [],
    modalities: [],
    city: '',
    state: '',
    servicePrice: 0,
    cref: '',
    availability: '',
    experienceYears: 0,
  }
}

function trainerToForm(trainer: PersonalTrainer): TrainerInfoPayload {
  return {
    name: trainer.name,
    contactPhone: trainer.contactPhone ?? '',
    profession: trainer.profession,
    description: trainer.description,
    specialties: [...(trainer.specialties ?? [])],
    modalities: [...(trainer.modalities ?? [])],
    city: trainer.city ?? '',
    state: trainer.state ?? '',
    servicePrice: trainer.servicePrice,
    cref: trainer.cref ?? '',
    availability: trainer.availability ?? '',
    experienceYears: trainer.experienceYears ?? 0,
  }
}

export function useFTTrainerInfoForm(trainer: Ref<PersonalTrainer | null>) {
  const { t } = useI18n()
  const toast = useFTToast()
  const { update, pending, error: apiError, fieldErrors: apiFieldErrors, resetStatus } = useUpdateTrainerProfile()
  const { setTrainer } = useMyTrainerProfile()
  const errorMessage = useFieldErrorTranslator('dashboard.info.errors')

  const form = reactive<TrainerInfoPayload>(emptyForm())
  const errors = ref<TrainerInfoValidationErrors>({})
  const hydratedTrainerId = ref<string | null>(null)

  function syncFormFromTrainer(value: PersonalTrainer) {
    Object.assign(form, trainerToForm(value))
  }

  watch(trainer, (value) => {
    if (!value) {
      return
    }

    if (hydratedTrainerId.value !== value.id) {
      syncFormFromTrainer(value)
      hydratedTrainerId.value = value.id
    }
  }, { immediate: true })

  const { specialtyItems, modalityItems } = useFTTrainerFieldOptions()

  async function handleSubmit() {
    errors.value = {}
    resetStatus()

    const validation = validateTrainerInfo(form)
    if (!validation.valid) {
      errors.value = validation.errors
      toast.error(t('dashboard.info.errors.validationFailed'))
      return
    }

    const payload: UpdateTrainerProfileRequest = {
      section: 'info',
      info: {
        name: form.name.trim(),
        contactPhone: form.contactPhone.trim(),
        profession: form.profession.trim(),
        description: form.description.trim(),
        specialties: [...form.specialties],
        modalities: [...form.modalities],
        city: form.city.trim(),
        state: form.state.trim().toUpperCase(),
        servicePrice: form.servicePrice,
        cref: form.cref.trim(),
        availability: form.availability.trim(),
        experienceYears: form.experienceYears,
      },
    }

    const updated = await update(payload)
    if (updated) {
      setTrainer(updated)
      syncFormFromTrainer(updated)
      hydratedTrainerId.value = updated.id
      toast.success(t('dashboard.info.success'))
      return
    }

    applyApiError({
      parsed: {
        message: apiError.value ?? 'dashboard.info.errors.submitFailed',
        fieldErrors: apiFieldErrors.value,
      },
      errors,
      toast,
      translate: t,
      translator: (field, code) => errorMessage(field, code),
      fallbackKey: 'dashboard.info.errors.submitFailed',
    })
  }

  return {
    form,
    errors,
    errorMessage,
    specialtyItems,
    modalityItems,
    pending,
    handleSubmit,
  }
}
