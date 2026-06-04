import type { Meta, StoryObj } from '@storybook/vue3'
import FTFilterPanel from './FTFilterPanel.vue'

const meta: Meta<typeof FTFilterPanel> = {
  title: 'Composite/FTFilterPanel',
  component: FTFilterPanel,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTFilterPanel>

export const Default: Story = {}
