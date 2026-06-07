import type { Meta, StoryObj } from '@storybook/vue3'
import FTTrainerSelectMenu from './FTTrainerSelectMenu.vue'

const meta: Meta<typeof FTTrainerSelectMenu> = {
  title: 'Composite/Report/FTTrainerSelectMenu',
  component: FTTrainerSelectMenu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTTrainerSelectMenu>

export const Default: Story = {
  args: { modelValue: '' },
}
