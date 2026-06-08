import type { Meta, StoryObj } from '@storybook/vue3'
import FTProfileGalleryViewerModal from './FTProfileGalleryViewerModal.vue'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import { getMockGalleryUrls } from '../../../../server/mocks/mock-photos'
import {
  storyGalleryActiveIndex,
  storyGalleryViewerOpen,
} from '../../../../../.storybook/mocks/useProfileGalleryViewer'

const meta: Meta<typeof FTProfileGalleryViewerModal> = {
  title: 'Composite/Profile/FTProfileGalleryViewerModal',
  component: FTProfileGalleryViewerModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Modal cinematográfico para visualizar as fotos da galeria do personal. Abre ao clicar em uma thumbnail no perfil público.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTProfileGalleryViewerModal>

export const Default: Story = {
  decorators: [
    () => {
      storyGalleryViewerOpen.value = true
      storyGalleryActiveIndex.value = 2

      return {
        components: { FTProfileGalleryViewerModal },
        setup: () => ({
          trainer: mockTrainer({ gallery: getMockGalleryUrls(0, 5) }),
        }),
        template: '<FTProfileGalleryViewerModal :trainer="trainer" />',
      }
    },
  ],
}

export const SinglePhoto: Story = {
  decorators: [
    () => {
      storyGalleryViewerOpen.value = true
      storyGalleryActiveIndex.value = 0

      return {
        components: { FTProfileGalleryViewerModal },
        setup: () => ({
          trainer: mockTrainer({ gallery: getMockGalleryUrls(0, 1) }),
        }),
        template: '<FTProfileGalleryViewerModal :trainer="trainer" />',
      }
    },
  ],
}
