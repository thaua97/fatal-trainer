import type { Meta, StoryObj } from '@storybook/vue3'
import FTProfileLocationRow from './FTProfileLocationRow.vue'

const meta: Meta<typeof FTProfileLocationRow> = {
  title: 'Composite/FTProfileLocationRow',
  component: FTProfileLocationRow,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTProfileLocationRow>

export const Default: Story = {}
