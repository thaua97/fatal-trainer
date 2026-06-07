export default defineNuxtPlugin(async () => {
  const { fetchMe, initialized } = useAuth()
  const config = useRuntimeConfig()

  if (initialized.value) {
    return
  }

  // Cross-origin API (backend em outra porta): cookie httpOnly não chega no SSR.
  // Restaura sessão apenas no client para evitar HTML de guest + hidratação autenticada.
  if (import.meta.server && !config.public.useMockApi) {
    return
  }

  await fetchMe()
})
