import type { Meta, StoryObj } from '@storybook/vue3'
import FTHireTrainerModal from './FTHireTrainerModal.vue'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import {
  storyCanContact,
  storyHireModalOpen,
  storyShowContactCta,
  storyShowLoginCta,
} from '../../../../../.storybook/mocks/useProfileHireModal'

const meta: Meta<typeof FTHireTrainerModal> = {
  title: 'Composite/Profile/FTHireTrainerModal',
  component: FTHireTrainerModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Modal de contratação exibida ao clicar em "Contratar personal". Mostra texto de conscientização e redireciona para WhatsApp (logado) ou login (deslogado).',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTHireTrainerModal>

export const Guest: Story = {
  decorators: [
    () => {
      storyHireModalOpen.value = true
      storyShowContactCta.value = false
      storyShowLoginCta.value = true
      storyCanContact.value = true

      return {
        components: { FTHireTrainerModal },
        setup: () => ({ trainer: mockTrainer() }),
        template: '<FTHireTrainerModal :trainer="trainer" />',
      }
    },
  ],
}

export const Authenticated: Story = {
  decorators: [
    () => {
      storyHireModalOpen.value = true
      storyShowContactCta.value = true
      storyShowLoginCta.value = false
      storyCanContact.value = true

      return {
        components: { FTHireTrainerModal },
        setup: () => ({ trainer: mockTrainer() }),
        template: '<FTHireTrainerModal :trainer="trainer" />',
      }
    },
  ],
}

export const NoPhone: Story = {
  decorators: [
    () => {
      storyHireModalOpen.value = true
      storyShowContactCta.value = true
      storyShowLoginCta.value = false
      storyCanContact.value = false

      return {
        components: { FTHireTrainerModal },
        setup: () => ({ trainer: mockTrainer({ contactPhone: undefined }) }),
        template: '<FTHireTrainerModal :trainer="trainer" />',
      }
    },
  ],
}
