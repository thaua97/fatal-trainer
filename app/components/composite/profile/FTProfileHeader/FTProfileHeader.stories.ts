import type { Meta, StoryObj } from '@storybook/vue3'
import FTProfileHeader from './FTProfileHeader.vue'

const meta: Meta<typeof FTProfileHeader> = {
  title: 'Composite/FTProfileHeader',
  component: FTProfileHeader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTProfileHeader>

export const Default: Story = {}
