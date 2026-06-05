export interface FTAppHeaderLink {
  key: string
  to: string
  icon?: string
}

const NAV_LINKS: FTAppHeaderLink[] = [
  { key: 'about', to: '/sobre', icon: 'i-lucide-info' },
  { key: 'trainers', to: '/personal-trainers', icon: 'i-lucide-users' },
  { key: 'report', to: '/denuncia', icon: 'i-lucide-flag' },
]

const AUTH_LINKS: FTAppHeaderLink[] = [
  { key: 'register', to: '/registro', icon: 'i-lucide-user-plus' },
  { key: 'login', to: '/login', icon: 'i-lucide-log-in' },
]

export function useFTAppHeader() {
  const route = useRoute()

  const homeTo = '/'

  function isNavActive(to: string) {
    if (to === '/') return route.path === '/'
    if (to === '/personal-trainers') return route.path === '/personal-trainers' || route.path.startsWith('/personal-trainers/')
    return route.path === to
  }

  function onHomeClick(event: MouseEvent) {
    if (route.path !== '/') return

    event.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    homeTo,
    navLinks: NAV_LINKS,
    authLinks: AUTH_LINKS,
    isNavActive,
    onHomeClick,
  }
}
