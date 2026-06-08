import type { RouteLocationRaw } from 'vue-router'
import { resolveAuthRedirect } from '#shared/domain/auth/services/resolve-auth-redirect'

const AUTH_PATHS = new Set(['/login', '/registro'])

function buildAuthRoute(path: '/login' | '/registro', redirect: string | null): RouteLocationRaw {
  return redirect ? { path, query: { redirect } } : { path }
}

export function useAuthRedirect() {
  const route = useRoute()

  const redirectTarget = computed(() => {
    const fromQuery = resolveAuthRedirect(route.query.redirect)
    if (fromQuery) {
      return fromQuery
    }

    if (AUTH_PATHS.has(route.path)) {
      return null
    }

    return route.fullPath
  })

  const loginRoute = computed(() => buildAuthRoute('/login', redirectTarget.value))
  const registerRoute = computed(() => buildAuthRoute('/registro', redirectTarget.value))

  return {
    redirectTarget,
    loginRoute,
    registerRoute,
  }
}
