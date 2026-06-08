import type { LoginPayload, LoginValidationErrors } from '#shared/domain/auth/entities/auth-payloads'
import { validateLogin } from '#shared/domain/auth/services/validate-login'
import type { LoginRequest } from '#shared/types/api'
import { applyApiError } from '~/composables/core/applyApiError'
import { useFieldErrorTranslator } from '~/composables/core/useFieldErrorTranslator'

function emptyForm(): LoginPayload {
  return { email: '', password: '' }
}

export function useFTAdminLoginForm() {
  const { t } = useI18n()
  const toast = useFTToast()
  const form = reactive<LoginPayload>(emptyForm())
  const errors = ref<LoginValidationErrors>({})
  const showPassword = ref(false)
  const { login, pending } = useAdminAuth()
  const errorMessage = useFieldErrorTranslator('admin.errors')

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

    const result = await login(payload)
    if (!result.success) {
      applyApiError({
        parsed: {
          message: result.error ?? 'admin.errors.loginFailed',
          fieldErrors: result.errors ?? {},
        },
        errors,
        toast,
        translate: t,
        translator: (field, code) => errorMessage(field, code),
        fallbackKey: 'admin.errors.loginFailed',
      })
    }
  }

  return {
    form,
    errors,
    errorMessage,
    pending,
    showPassword,
    handleSubmit,
  }
}
