import type { Meta, StoryObj } from '@storybook/vue3'
import FTPromoBadge from './FTPromoBadge.vue'
import { promoBadgeArgTypes } from '@tests/helpers/story-helpers'

const meta: Meta<typeof FTPromoBadge> = {
  title: 'UI/FTPromoBadge',
  component: FTPromoBadge,
  tags: ['autodocs'],
  argTypes: promoBadgeArgTypes,
  parameters: {
    docs: {
      description: {
        component: 'Badge de promoção em tons verdes (`--ft-promo`, `--ft-promo-strong`). Exibe label customizada ou percentual de desconto.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTPromoBadge>

export const DiscountPercent: Story = {
  args: { percent: 25 },
}

export const CustomLabel: Story = {
  args: { label: 'Primeira sessão' },
}

export const Small: Story = {
  args: { percent: 15, size: 'sm' },
}
