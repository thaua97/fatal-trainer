import type { Meta, StoryObj } from '@storybook/vue3'
import FTFilterFab from './FTFilterFab.vue'

const meta: Meta<typeof FTFilterFab> = {
  title: 'Composite/FTFilterFab',
  component: FTFilterFab,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTFilterFab>

export const Default: Story = {}
