import type { Meta, StoryObj } from '@storybook/vue3'
import FTTrainerCardSkeleton from './FTTrainerCardSkeleton.vue'

const meta: Meta<typeof FTTrainerCardSkeleton> = {
  title: 'UI/FTTrainerCardSkeleton',
  component: FTTrainerCardSkeleton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTTrainerCardSkeleton>

export const Default: Story = {
  args: {},

}

