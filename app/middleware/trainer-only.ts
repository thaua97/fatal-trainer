export default defineNuxtRouteMiddleware(async (to) => {
  const { initialized, isAuthenticated, userRole, fetchMe } = useAuth()

  if (!initialized.value) {
    await fetchMe()
  }

  if (!isAuthenticated.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (userRole.value !== 'personal-trainer') {
    return navigateTo('/')
  }
})
