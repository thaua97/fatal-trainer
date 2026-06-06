export default defineNuxtRouteMiddleware(async () => {
  const { initialized, isAuthenticated, userRole, fetchMe } = useAuth()

  if (!initialized.value) {
    await fetchMe()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (userRole.value !== 'personal-trainer') {
    const toast = useToast()
    const { t } = useI18n()
    toast.add({
      title: t('dashboard.errors.forbidden'),
      color: 'error',
    })
    return navigateTo('/')
  }
})
