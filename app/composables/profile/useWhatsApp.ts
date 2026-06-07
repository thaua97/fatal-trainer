import {
  buildWhatsAppUrl,
  formatBrazilianPhoneForWhatsApp,
} from '#shared/utils/whatsapp'

interface UseWhatsAppOptions {
  phone: MaybeRefOrGetter<string | undefined>
  trainerName: MaybeRefOrGetter<string>
}

export function useWhatsApp({ phone, trainerName }: UseWhatsAppOptions) {
  const { t } = useI18n()

  const message = computed(() =>
    t('profile.whatsappMessage', { name: toValue(trainerName) }),
  )

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
