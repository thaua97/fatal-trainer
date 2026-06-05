import type { Meta, StoryObj } from '@storybook/vue3'
import FTTrainerCard from './FTTrainerCard.vue'
import { mockPromoTrainer, mockTrainer } from '@tests/helpers/mock-trainer'

const meta: Meta<typeof FTTrainerCard> = {
  title: 'Composite/Catalog/FTTrainerCard',
  component: FTTrainerCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Card de listagem com rating, modalidade, distância e preço. Suporta badge e preço promocional em verde.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTTrainerCard>

export const Default: Story = {
  args: { trainer: mockTrainer() },
}

export const OnPromotion: Story = {
  args: { trainer: mockPromoTrainer() },
  parameters: {
    docs: {
      description: {
        story: 'Trainer em promoção com badge verde e preço riscado.',
      },
    },
  },
}

export const LongName: Story = {
  args: { trainer: mockTrainer({ name: 'Ana Carolina de Souza e Silva Mendonça' }) },
}

export const Desktop: Story = {
  args: { trainer: mockPromoTrainer() },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    layout: 'padded',
  },
  decorators: [
    (_, { args }) => ({
      components: { FTTrainerCard },
      setup: () => ({ args }),
      template: '<div class="max-w-3xl"><FTTrainerCard v-bind="args" /></div>',
    }),
  ],
}
