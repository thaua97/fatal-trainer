import type { Meta, StoryObj } from '@storybook/vue3'
import FTProfileCta from './FTProfileCta.vue'
import { mockPromoTrainer, mockTrainer } from '@tests/helpers/mock-trainer'

const meta: Meta<typeof FTProfileCta> = {
  title: 'Composite/Profile/FTProfileCta',
  component: FTProfileCta,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'CTA fixo mobile com preço promocional acima do botão de contratação. Abre o modal de contratação ao clicar.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTProfileCta>

export const Default: Story = {
  args: { trainer: mockTrainer() },
  decorators: [
    (_, { args }) => ({
      components: { FTProfileCta },
      setup: () => ({ args }),
      template: '<div class="relative h-48"><FTProfileCta v-bind="args" /></div>',
    }),
  ],
}

export const OnPromotion: Story = {
  args: { trainer: mockPromoTrainer() },
  decorators: [
    (_, { args }) => ({
      components: { FTProfileCta },
      setup: () => ({ args }),
      template: '<div class="relative h-56"><FTProfileCta v-bind="args" /></div>',
    }),
  ],
}
