import type { Meta, StoryObj } from '@storybook/vue3'
import FTServicePricing from './FTServicePricing.vue'

const meta: Meta<typeof FTServicePricing> = {
  title: 'UI/FTServicePricing',
  component: FTServicePricing,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTServicePricing>

export const Default: Story = {
  args: {
    sessionPrice: 187,
    monthlyPrice: 1496,
  },
}

export const Promotional: Story = {
  args: {
    sessionPrice: 200,
    sessionPromoPrice: 150,
    monthlyPrice: 1600,
    monthlyPromoPrice: 1200,
    discountPercent: 25,
    promotionLabel: 'Primeira sessão com desconto',
    promotionValidity: 'Válido até 30/06',
  },
}
