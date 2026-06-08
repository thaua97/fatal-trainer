import type { Meta, StoryObj } from '@storybook/vue3'
import FTStarRating from './FTStarRating.vue'

const meta: Meta<typeof FTStarRating> = {
  title: 'UI/FTStarRating',
  component: FTStarRating,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTStarRating>

export const Default: Story = {
  args: {rating:4.9},

}

