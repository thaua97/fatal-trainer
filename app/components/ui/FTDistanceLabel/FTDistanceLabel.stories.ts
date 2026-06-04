import type { Meta, StoryObj } from '@storybook/vue3'
import FTDistanceLabel from './FTDistanceLabel.vue'

const meta: Meta<typeof FTDistanceLabel> = {
  title: 'UI/FTDistanceLabel',
  component: FTDistanceLabel,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTDistanceLabel>

export const Default: Story = {
  args: {distanceKm:2.3},

}

