import { ref } from 'vue'

export const storyHireModalOpen = ref(true)
export const storyShowContactCta = ref(false)
export const storyShowLoginCta = ref(true)
export const storyCanContact = ref(true)

export function useProfileHireModal() {
  return {
    modalOpen: storyHireModalOpen,
    showContactCta: storyShowContactCta,
    showLoginCta: storyShowLoginCta,
    loginPath: '/login?redirect=%2Fpersonal-trainers%2Ftrainer-001',
    canContact: storyCanContact,
    openModal: () => {
      storyHireModalOpen.value = true
    },
    closeModal: () => {
      storyHireModalOpen.value = false
    },
    handleContact: () => {},
  }
}
