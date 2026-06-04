import type { Meta, StoryObj } from '@storybook/vue3'
import FTSearchInput from './FTSearchInput.vue'

const meta: Meta<typeof FTSearchInput> = {
  title: 'UI/FTSearchInput',
  component: FTSearchInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTSearchInput>

export const Default: Story = {
  args: {modelValue:""},

}
export const WithValue: Story = { args: { modelValue: 'funcional' } }
