import type { Meta, StoryObj } from '@storybook/vue3'
import FTActiveFilterChips from './FTActiveFilterChips.vue'

const meta: Meta<typeof FTActiveFilterChips> = {
  title: 'Composite/FTActiveFilterChips',
  component: FTActiveFilterChips,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTActiveFilterChips>

export const Default: Story = {}
