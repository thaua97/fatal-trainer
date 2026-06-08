import type { LoginPayload, LoginValidationErrors } from '#shared/domain/auth/entities/auth-payloads'
import { validateLogin } from '#shared/domain/auth/services/validate-login'
import type { LoginRequest } from '#shared/types/api'

function emptyForm(): LoginPayload {
  return {
    email: '',
    password: '',
  }
}

export function useFTLoginForm() {
  const route = useRoute()
  const { t } = useI18n()
  const toast = useToast()
  const { login, pending } = useAuth()

  const form = reactive<LoginPayload>(emptyForm())
  const errors = ref<LoginValidationErrors>({})
  const submitError = ref<string | null>(null)
  const showPassword = ref(false)

  function errorMessage(field: keyof LoginValidationErrors, code?: string): string | undefined {
    if (!code) {
      return undefined
    }
    const key = `auth.errors.${field}.${code}`
    const translated = t(key)
    return translated === key ? code : translated
  }

  const fieldErrors = computed(() => ({
    email: errorMessage('email', errors.value.email),
    password: errorMessage('password', errors.value.password),
  }))

  async function handleSubmit() {
    errors.value = {}
    submitError.value = null

    const validation = validateLogin(form)
    if (!validation.valid) {
      errors.value = validation.errors
      return
    }

    const payload: LoginRequest = {
      email: form.email.trim(),
      password: form.password,
    }

    const result = await login(payload, typeof route.query.redirect === 'string' ? route.query.redirect : null)
    if (!result.success) {
      if (result.errors && Object.keys(result.errors).length > 0) {
        errors.value = result.errors
      } else {
        submitError.value = t('auth.errors.submitFailed')
      }
    }
  }

  function handleForgotPassword() {
    toast.add({
      title: t('auth.login.forgotPasswordToast'),
      color: 'neutral',
    })
  }

  return {
    form,
    fieldErrors,
    pending,
    submitError,
    showPassword,
    handleSubmit,
    handleForgotPassword,
  }
}
