import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

export function useProfileHireModal(trainer: Ref<PersonalTrainer>) {
  const route = useRoute()
  const { isAuthenticated, user, initialized } = useAuth()

  const modalOpen = useState('profile-hire-modal-open', () => false)

  const userName = computed(() => user.value?.name)

  const { openChat, canContact } = useWhatsApp({
    phone: computed(() => trainer.value.contactPhone),
    trainerName: computed(() => trainer.value.name),
    userName,
  })

  const isTrainerActive = computed(() => trainer.value.isActive !== false)

  const hireUnavailableReason = computed<'inactive' | 'noPhone' | null>(() => {
    if (!isTrainerActive.value) {
      return 'inactive'
    }

    if (!canContact.value) {
      return 'noPhone'
    }

    return null
  })

  const canHire = computed(() => hireUnavailableReason.value === null)

  const showContactCta = computed(
    () => initialized.value && isAuthenticated.value,
  )

  const showLoginCta = computed(
    () => initialized.value && !isAuthenticated.value,
  )

  const loginPath = computed(() => {
    const redirect = encodeURIComponent(route.fullPath)
    return `/login?redirect=${redirect}`
  })

  function openModal() {
    if (!canHire.value) {
      return
    }

    modalOpen.value = true
  }

  function closeModal() {
    modalOpen.value = false
  }

  function handleContact() {
    if (!canContact.value) {
      return
    }

    closeModal()
    openChat()
  }

  return {
    modalOpen,
    showContactCta,
    showLoginCta,
    loginPath,
    canContact,
    canHire,
    hireUnavailableReason,
    openModal,
    closeModal,
    handleContact,
  }
}
