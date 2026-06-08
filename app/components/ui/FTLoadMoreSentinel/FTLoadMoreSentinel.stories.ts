import type { Meta, StoryObj } from '@storybook/vue3'
import FTLoadMoreSentinel from './FTLoadMoreSentinel.vue'

const meta: Meta<typeof FTLoadMoreSentinel> = {
  title: 'UI/FTLoadMoreSentinel',
  component: FTLoadMoreSentinel,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTLoadMoreSentinel>

export const Default: Story = {
  args: {loading:true,hasMore:true},

}

