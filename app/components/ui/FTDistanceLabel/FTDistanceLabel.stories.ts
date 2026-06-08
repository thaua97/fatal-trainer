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
  args: { city: 'São Paulo', state: 'SP' },
}

export const CityOnly: Story = {
  args: { city: 'Rio de Janeiro' },
}
