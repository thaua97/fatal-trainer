import type { Meta, StoryObj } from '@storybook/vue3'
import FTCrefInput from './FTCrefInput.vue'

const meta: Meta<typeof FTCrefInput> = {
  title: 'UI/FTCrefInput',
  component: FTCrefInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTCrefInput>

export const Default: Story = {
  args: { modelValue: '' },
}

export const WithValue: Story = {
  args: { modelValue: '123456-G/SP' },
}
