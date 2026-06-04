import type { Meta, StoryObj } from '@storybook/vue3'
import FTProfileReviewList from './FTProfileReviewList.vue'

const meta: Meta<typeof FTProfileReviewList> = {
  title: 'Composite/FTProfileReviewList',
  component: FTProfileReviewList,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTProfileReviewList>

export const Default: Story = {}
