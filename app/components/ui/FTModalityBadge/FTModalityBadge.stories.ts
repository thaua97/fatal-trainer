import type { Meta, StoryObj } from '@storybook/vue3'
import FTModalityBadge from './FTModalityBadge.vue'

const meta: Meta<typeof FTModalityBadge> = {
  title: 'UI/FTModalityBadge',
  component: FTModalityBadge,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTModalityBadge>

export const Default: Story = {
  args: {modality:"presencial"},

}
export const Online: Story = { args: { modality: 'online' } }
