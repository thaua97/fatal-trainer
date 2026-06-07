import type { LoginPayload, LoginValidationErrors } from '#shared/domain/auth/entities/auth-payloads'
import { validateLogin } from '#shared/domain/auth/services/validate-login'
import type { LoginRequest } from '#shared/types/api'

function emptyForm(): LoginPayload {
  return { email: '', password: '' }
}

export function useFTAdminLoginForm() {
  const form = reactive<LoginPayload>(emptyForm())
  const errors = ref<LoginValidationErrors>({})
  const submitError = ref<string | null>(null)
  const showPassword = ref(false)
  const { login, pending } = useAdminAuth()

  const fieldErrors = computed(() => ({
    email: errors.value.email ? 'E-mail inválido' : undefined,
    password: errors.value.password ? 'Senha obrigatória' : undefined,
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

    const result = await login(payload)
    if (!result.success) {
      submitError.value = result.error ?? 'Falha ao entrar.'
    }
  }

  return {
    form,
    fieldErrors,
    pending,
    submitError,
    showPassword,
    handleSubmit,
  }
}
