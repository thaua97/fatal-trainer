import type { Meta, StoryObj } from '@storybook/vue3'
import FTProfileGallery from './FTProfileGallery.vue'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import { getMockGalleryUrls } from '../../../../server/mocks/mock-photos'

const meta: Meta<typeof FTProfileGallery> = {
  title: 'Composite/Profile/FTProfileGallery',
  component: FTProfileGallery,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Grid de thumbnails da galeria do personal. Cada foto é clicável e abre o visualizador em modal.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTProfileGallery>

export const Default: Story = {
  args: {
    trainer: mockTrainer({ gallery: getMockGalleryUrls(0, 6) }),
  },
}
