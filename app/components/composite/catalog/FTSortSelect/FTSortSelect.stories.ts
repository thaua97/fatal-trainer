import type { Meta, StoryObj } from '@storybook/vue3'
import FTSortSelect from './FTSortSelect.vue'

const meta: Meta<typeof FTSortSelect> = {
  title: 'Composite/FTSortSelect',
  component: FTSortSelect,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTSortSelect>

export const Default: Story = {}
