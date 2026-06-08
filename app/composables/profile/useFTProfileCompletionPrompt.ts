import { formatBrazilianPhoneForWhatsApp } from '#shared/utils/whatsapp'

const HIDDEN_ROUTES = ['/painel/perfil', '/login', '/registro']

export function useFTProfileCompletionPrompt() {
  const route = useRoute()
  const { user, userRole, initialized, isAuthenticated } = useAuth()
  const { trainer } = useMyTrainerProfile()

  // Auth and localStorage resolve only on the client; defer UI until after hydration.
  const isMounted = ref(false)
  onMounted(() => {
    isMounted.value = true
  })

  const isMinimized = useLocalStorage('ft-profile-completion-prompt-minimized', false)

  const shouldRender = computed(() =>
    initialized.value
    && isAuthenticated.value
    && userRole.value === 'personal-trainer',
  )

  const resolvedPhone = computed(() =>
    user.value?.phoneNumber?.trim() || trainer.value?.contactPhone?.trim() || '',
  )

  const hasValidPhone = computed(() =>
    formatBrazilianPhoneForWhatsApp(resolvedPhone.value) !== null,
  )

  const isHiddenRoute = computed(() =>
    HIDDEN_ROUTES.some(path => route.path.startsWith(path)),
  )

  const needsPrompt = computed(() =>
    shouldRender.value && !hasValidPhone.value && !isHiddenRoute.value,
  )

  const shouldShow = computed(() =>
    isMounted.value && needsPrompt.value && !isMinimized.value,
  )

  const showFab = computed(() =>
    isMounted.value && needsPrompt.value && isMinimized.value,
  )

  function minimize() {
    isMinimized.value = true
  }

  function expand() {
    isMinimized.value = false
  }

  watch(hasValidPhone, (valid) => {
    if (valid) {
      isMinimized.value = false
    }
  })

  return {
    shouldShow,
    showFab,
    minimize,
    expand,
  }
}
