export default defineNuxtPlugin(async () => {
  const route = useRoute()

  if (!route.path.startsWith('/admin')) {
    return
  }

  const { initialized, fetchAdminMe } = useAdminAuth()

  if (!initialized.value) {
    await fetchAdminMe()
  }
})
