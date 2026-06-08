import type { RegisterPayload, RegisterValidationErrors } from '#shared/domain/auth/entities/auth-payloads'
import { validateRegister } from '#shared/domain/auth/services/validate-register'
import type { RegisterRequest } from '#shared/types/api'
import { applyApiError } from '~/composables/core/applyApiError'
import { useFieldErrorTranslator } from '~/composables/core/useFieldErrorTranslator'

function emptyForm(): RegisterPayload {
  return {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    termsAccepted: false,
  }
}

export function useFTRegisterForm() {
  const { t } = useI18n()
  const toast = useFTToast()
  const { register, pending } = useAuth()
  const errorMessage = useFieldErrorTranslator('auth.errors')

  const form = reactive<RegisterPayload>(emptyForm())
  const errors = ref<RegisterValidationErrors>({})
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)

  async function handleSubmit() {
    errors.value = {}

    const validation = validateRegister(form)
    if (!validation.valid) {
      errors.value = validation.errors
      return
    }

    const payload: RegisterRequest = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      role: form.role as RegisterRequest['role'],
      termsAccepted: form.termsAccepted,
    }

    const result = await register(payload)
    if (!result.success) {
      applyApiError({
        parsed: {
          message: result.errorMessage ?? 'auth.errors.submitFailed',
          fieldErrors: result.errors ?? {},
        },
        errors,
        toast,
        translate: t,
        translator: (field, code) => errorMessage(field, code),
        fallbackKey: 'auth.errors.submitFailed',
      })
    }
  }

  return {
    form,
    errors,
    errorMessage,
    pending,
    showPassword,
    showConfirmPassword,
    handleSubmit,
  }
}
