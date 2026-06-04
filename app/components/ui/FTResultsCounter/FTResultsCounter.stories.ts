import type { Meta, StoryObj } from '@storybook/vue3'
import FTResultsCounter from './FTResultsCounter.vue'

const meta: Meta<typeof FTResultsCounter> = {
  title: 'UI/FTResultsCounter',
  component: FTResultsCounter,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTResultsCounter>

export const Default: Story = {
  args: {total:42},

}
export const Filtered: Story = { args: { total: 100, filtered: 12 } }
