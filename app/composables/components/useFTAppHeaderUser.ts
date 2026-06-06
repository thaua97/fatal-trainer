import type { DropdownMenuItem } from '@nuxt/ui'
import type { FTLocaleCode } from '#shared/types/locale'

export function useFTAppHeaderUser() {
  const { t } = useI18n()
  const { userName, userRole, user, logout, pending } = useAuth()
  const { localeItems, currentLocale, switchLocale } = useFTLocaleSwitcher()

  const avatarUrl = computed(() => user.value?.avatarUrl)
  const roleLabel = computed(() => {
    if (userRole.value === 'student') return t('auth.header.roleStudent')
    if (userRole.value === 'personal-trainer') return t('auth.header.rolePersonal')
    return ''
  })

  function localeMenuLabel(code: FTLocaleCode) {
    if (code === 'pt-BR') return t('locale.pt-BR')
    if (code === 'es-ES') return t('locale.es-ES')
    return t('locale.en-US')
  }

  const menuItems = computed<DropdownMenuItem[][]>(() => {
    const sections: DropdownMenuItem[][] = []

    if (userRole.value === 'personal-trainer') {
      sections.push([{
        label: t('header.myProfile'),
        icon: 'i-lucide-layout-dashboard',
        to: '/painel/perfil',
      }])
    }

    sections.push([
      { type: 'label', label: t('header.language') },
      ...localeItems.value.map(item => ({
        label: localeMenuLabel(item.code as FTLocaleCode),
        icon: item.code === currentLocale.value ? 'i-lucide-check' : 'i-lucide-languages',
        onSelect: () => switchLocale(item.code as FTLocaleCode),
      })),
    ])

    sections.push([
      { type: 'separator' },
      {
        label: t('auth.header.logout'),
        icon: 'i-lucide-log-out',
        onSelect: () => logout(),
      },
    ])

    return sections
  })

  return {
    userName,
    userRole,
    avatarUrl,
    roleLabel,
    menuItems,
    pending,
  }
}
