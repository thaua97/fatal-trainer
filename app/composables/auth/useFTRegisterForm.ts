import type { RegisterPayload, RegisterValidationErrors } from '#shared/domain/auth/entities/auth-payloads'
import { validateRegister } from '#shared/domain/auth/services/validate-register'
import type { RegisterRequest } from '#shared/types/api'

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
  const { register, pending } = useAuth()

  const form = reactive<RegisterPayload>(emptyForm())
  const errors = ref<RegisterValidationErrors>({})
  const submitError = ref<string | null>(null)
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)

  function errorMessage(field: keyof RegisterValidationErrors, code?: string): string | undefined {
    if (!code) {
      return undefined
    }
    const key = `auth.errors.${field}.${code}`
    const translated = t(key)
    return translated === key ? code : translated
  }

  const fieldErrors = computed(() => ({
    name: errorMessage('name', errors.value.name),
    email: errorMessage('email', errors.value.email),
    password: errorMessage('password', errors.value.password),
    confirmPassword: errorMessage('confirmPassword', errors.value.confirmPassword),
    role: errorMessage('role', errors.value.role),
    termsAccepted: errorMessage('termsAccepted', errors.value.termsAccepted),
  }))

  async function handleSubmit() {
    errors.value = {}
    submitError.value = null

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
      if (result.errors && Object.keys(result.errors).length > 0) {
        errors.value = result.errors
      } else {
        submitError.value = t('auth.errors.submitFailed')
      }
    }
  }

  return {
    form,
    fieldErrors,
    pending,
    submitError,
    showPassword,
    showConfirmPassword,
    handleSubmit,
  }
}
