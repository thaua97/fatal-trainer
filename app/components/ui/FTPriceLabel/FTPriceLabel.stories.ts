import type { Meta, StoryObj } from '@storybook/vue3'
import FTPriceLabel from './FTPriceLabel.vue'

const meta: Meta<typeof FTPriceLabel> = {
  title: 'UI/FTPriceLabel',
  component: FTPriceLabel,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTPriceLabel>

export const Default: Story = {
  args: {price:120},

}
export const Large: Story = { args: { price: 150, size: 'lg' } }
