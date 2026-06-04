import type { Meta, StoryObj } from '@storybook/vue3'
import FTAppHeader from './FTAppHeader.vue'

const meta: Meta<typeof FTAppHeader> = {
  title: 'Composite/FTAppHeader',
  component: FTAppHeader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTAppHeader>

export const Default: Story = {}
