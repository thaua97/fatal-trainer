import type { Meta, StoryObj } from '@storybook/vue3'
import FTPhoneInput from './FTPhoneInput.vue'

const meta: Meta<typeof FTPhoneInput> = {
  title: 'UI/FTPhoneInput',
  component: FTPhoneInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTPhoneInput>

export const Default: Story = {
  args: { modelValue: '' },
}

export const WithValue: Story = {
  args: { modelValue: '(11) 99999-8888' },
}
