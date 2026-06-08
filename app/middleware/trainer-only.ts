export default defineNuxtRouteMiddleware(async () => {
  const { initialized, isAuthenticated, userRole, fetchMe } = useAuth()
  const toast = useToast()
  const { t } = useI18n()

  if (!initialized.value) {
    await fetchMe()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (userRole.value !== 'personal-trainer') {
    toast.add({
      title: t('dashboard.errors.forbidden'),
      color: 'error',
    })
    return navigateTo('/')
  }
})
