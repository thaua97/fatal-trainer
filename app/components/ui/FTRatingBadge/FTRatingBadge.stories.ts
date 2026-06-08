import type { Meta, StoryObj } from '@storybook/vue3'
import FTRatingBadge from './FTRatingBadge.vue'

const meta: Meta<typeof FTRatingBadge> = {
  title: 'UI/FTRatingBadge',
  component: FTRatingBadge,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTRatingBadge>

export const Default: Story = {
  args: {rating:4.8,reviewCount:42},

}
export const WithoutCount: Story = { args: { rating: 4.5 } }
