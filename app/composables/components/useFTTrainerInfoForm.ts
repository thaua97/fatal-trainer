import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { TrainerInfoField, TrainerInfoPayload, TrainerInfoValidationErrors } from '#shared/domain/catalog/entities/trainer-profile-payloads'
import { validateTrainerInfo } from '#shared/domain/catalog/services/validate-trainer-profile'
import type { UpdateTrainerProfileRequest } from '#shared/types/api'

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
  const { update, pending, success, error: submitError, fieldErrors: submitFieldErrors, resetStatus } = useUpdateTrainerProfile()
  const { setTrainer } = useMyTrainerProfile()

  const form = reactive<TrainerInfoPayload>(emptyForm())
  const errors = ref<TrainerInfoValidationErrors>({})

  watch(trainer, (value) => {
    if (value) {
      Object.assign(form, trainerToForm(value))
    }
  }, { immediate: true })

  const { specialtyItems, modalityItems } = useFTTrainerFieldOptions()

  function errorMessage(field: TrainerInfoField, code?: string): string | undefined {
    if (!code) {
      return undefined
    }

    const key = `dashboard.info.errors.${field}.${code}`
    const translated = t(key)
    return translated === key ? code : translated
  }

  const fieldErrors = computed(() => ({
    name: errorMessage('name', errors.value.name ?? submitFieldErrors.value.name),
    contactPhone: errorMessage('contactPhone', errors.value.contactPhone ?? submitFieldErrors.value.contactPhone),
    profession: errorMessage('profession', errors.value.profession ?? submitFieldErrors.value.profession),
    description: errorMessage('description', errors.value.description ?? submitFieldErrors.value.description),
    specialties: errorMessage('specialties', errors.value.specialties ?? submitFieldErrors.value.specialties),
    modalities: errorMessage('modalities', errors.value.modalities ?? submitFieldErrors.value.modalities),
    city: errorMessage('city', errors.value.city ?? submitFieldErrors.value.city),
    state: errorMessage('state', errors.value.state ?? submitFieldErrors.value.state),
    servicePrice: errorMessage('servicePrice', errors.value.servicePrice ?? submitFieldErrors.value.servicePrice),
    cref: errorMessage('cref', errors.value.cref ?? submitFieldErrors.value.cref),
    availability: errorMessage('availability', errors.value.availability ?? submitFieldErrors.value.availability),
    experienceYears: errorMessage('experienceYears', errors.value.experienceYears ?? submitFieldErrors.value.experienceYears),
  }))

  async function handleSubmit() {
    errors.value = {}
    resetStatus()

    const validation = validateTrainerInfo(form)
    if (!validation.valid) {
      errors.value = validation.errors
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
    }
  }

  return {
    form,
    specialtyItems,
    modalityItems,
    fieldErrors,
    pending,
    success,
    submitError,
    handleSubmit,
  }
}
