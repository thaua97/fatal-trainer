import type { Meta, StoryObj } from '@storybook/vue3'
import FTPriceLabel from './FTPriceLabel.vue'
import { priceLabelArgTypes, promoDocsDescription } from '@tests/helpers/story-helpers'

const meta: Meta<typeof FTPriceLabel> = {
  title: 'UI/FTPriceLabel',
  component: FTPriceLabel,
  tags: ['autodocs'],
  argTypes: priceLabelArgTypes,
  parameters: {
    docs: {
      description: {
        component: promoDocsDescription,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTPriceLabel>

export const Default: Story = {
  args: { price: 120 },
}

export const Large: Story = {
  args: { price: 150, size: 'lg' },
}

export const Promotional: Story = {
  args: {
    price: 200,
    promoPrice: 150,
    showDiscount: true,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Preço promocional em verde (`--ft-promo`) com valor original riscado e badge de desconto.',
      },
    },
  },
}

export const ResponsivePromotional: Story = {
  args: {
    price: 180,
    promoPrice: 135,
    showDiscount: true,
    size: 'responsive',
  },
}

export const Monthly: Story = {
  args: {
    price: 960,
    priceView: 'monthly',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Exibe o sufixo "por mês" quando a visualização mensal está ativa.',
      },
    },
  },
}
