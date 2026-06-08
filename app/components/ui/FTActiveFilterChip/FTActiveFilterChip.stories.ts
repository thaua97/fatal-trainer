import type { Meta, StoryObj } from '@storybook/vue3'
import FTActiveFilterChip from './FTActiveFilterChip.vue'

const meta: Meta<typeof FTActiveFilterChip> = {
  title: 'UI/FTActiveFilterChip',
  component: FTActiveFilterChip,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTActiveFilterChip>

export const Default: Story = {
  args: {label:"Funcional"},

}

