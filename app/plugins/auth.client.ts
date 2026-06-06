export default defineNuxtPlugin(async () => {
  const { fetchMe, initialized } = useAuth()

  if (!initialized.value) {
    await fetchMe()
  }
})
