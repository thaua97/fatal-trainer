export default defineNuxtRouteMiddleware(async () => {
  const { initialized, isAdminAuthenticated, fetchAdminMe } = useAdminAuth()

  if (!initialized.value) {
    await fetchAdminMe()
  }

  if (!isAdminAuthenticated.value) {
    return navigateTo('/admin')
  }
})
