export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path !== '/admin') {
    return
  }

  const { initialized, isAdminAuthenticated, fetchAdminMe } = useAdminAuth()

  if (!initialized.value) {
    await fetchAdminMe()
  }

  if (isAdminAuthenticated.value) {
    return navigateTo('/admin/usuarios')
  }
})
