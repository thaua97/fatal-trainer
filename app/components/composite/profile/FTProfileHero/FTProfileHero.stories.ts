import type { Meta, StoryObj } from '@storybook/vue3'
import FTProfileHero from './FTProfileHero.vue'
import { mockPromoTrainer, mockTrainer } from '@tests/helpers/mock-trainer'

const meta: Meta<typeof FTProfileHero> = {
  title: 'Composite/Profile/FTProfileHero',
  component: FTProfileHero,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Hero do perfil com foto, rating, preço e detalhes de promoção em verde.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTProfileHero>

export const Default: Story = {
  args: { trainer: mockTrainer() },
}

export const OnPromotion: Story = {
  args: { trainer: mockPromoTrainer() },
  parameters: {
    docs: {
      description: {
        story: 'Exibe badge, preço promocional e validade da oferta.',
      },
    },
  },
}
