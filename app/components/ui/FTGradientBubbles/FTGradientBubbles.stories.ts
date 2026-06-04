import type { Meta, StoryObj } from '@storybook/vue3'
import FTGradientBubbles from './FTGradientBubbles.vue'

const meta: Meta<typeof FTGradientBubbles> = {
  title: 'UI/FTGradientBubbles',
  component: FTGradientBubbles,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTGradientBubbles>

export const Default: Story = {
  args: {},

}

