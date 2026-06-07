import type { Meta, StoryObj } from '@storybook/vue3'
import FTDatePicker from './FTDatePicker.vue'

const meta: Meta<typeof FTDatePicker> = {
  title: 'UI/FTDatePicker',
  component: FTDatePicker,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTDatePicker>

export const Empty: Story = {
  args: { modelValue: '' },
}

export const WithValue: Story = {
  args: { modelValue: '2025-05-15' },
}
