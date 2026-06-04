export function useFTAppHeader() {
  const route = useRoute()

  const homeTo = computed(() => {
    if (route.path === '/') return '/'
    return '/'
  })

  return { homeTo }
}
