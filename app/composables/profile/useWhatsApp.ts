import {
  buildWhatsAppUrl,
  formatBrazilianPhoneForWhatsApp,
} from '#shared/utils/whatsapp'

interface UseWhatsAppOptions {
  phone: MaybeRefOrGetter<string | undefined>
  trainerName: MaybeRefOrGetter<string>
  userName?: MaybeRefOrGetter<string | undefined>
}

export function useWhatsApp({ phone, trainerName, userName }: UseWhatsAppOptions) {
  const { t } = useI18n()

  const message = computed(() => {
    const trainer = toValue(trainerName)
    const user = toValue(userName)

    if (user) {
      return t('hireModal.whatsappMessage', { trainerName: trainer, userName: user })
    }

    return t('profile.whatsappMessage', { name: trainer })
  })

  const canContact = computed(
    () => formatBrazilianPhoneForWhatsApp(toValue(phone) ?? '') != null,
  )

  function openChat() {
    const digits = formatBrazilianPhoneForWhatsApp(toValue(phone) ?? '')
    if (!digits) {
      return
    }

    window.open(
      buildWhatsAppUrl(digits, message.value),
      '_blank',
      'noopener,noreferrer',
    )
  }

  return {
    openChat,
    canContact,
    message,
  }
}
