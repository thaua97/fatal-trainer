import type { LoginPayload, LoginValidationErrors } from '#shared/domain/auth/entities/auth-payloads'
import { validateLogin } from '#shared/domain/auth/services/validate-login'
import type { LoginRequest } from '#shared/types/api'
import { applyApiError } from '~/composables/core/applyApiError'
import { useFieldErrorTranslator } from '~/composables/core/useFieldErrorTranslator'

function emptyForm(): LoginPayload {
  return {
    email: '',
    password: '',
  }
}

export function useFTLoginForm() {
  const route = useRoute()
  const { t } = useI18n()
  const toast = useFTToast()
  const { login, pending } = useAuth()
  const errorMessage = useFieldErrorTranslator('auth.errors')

  const form = reactive<LoginPayload>(emptyForm())
  const errors = ref<LoginValidationErrors>({})
  const showPassword = ref(false)

  async function handleSubmit() {
    errors.value = {}

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

  function handleForgotPassword() {
    toast.neutral(t('auth.login.forgotPasswordToast'))
  }

  return {
    form,
    errors,
    errorMessage,
    pending,
    showPassword,
    handleSubmit,
    handleForgotPassword,
  }
}
