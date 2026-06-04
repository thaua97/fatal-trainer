import type { Meta, StoryObj } from '@storybook/vue3'
import FTTrainerCardSkeleton from '../../../ui/FTTrainerCardSkeleton/FTTrainerCardSkeleton.vue'
import FTTrainerList from './FTTrainerList.vue'

const meta: Meta<typeof FTTrainerList> = {
  title: 'Composite/Catalog/FTTrainerList',
  component: FTTrainerList,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTTrainerList>

export const Default: Story = {}

export const Loading: Story = {
  render: () => ({
    components: { FTTrainerCardSkeleton },
    template: `
      <div
        class="flex flex-col"
        data-testid="trainer-list-loading"
        aria-busy="true"
        aria-label="Carregando personal trainers"
      >
        <FTTrainerCardSkeleton v-for="index in 6" :key="index" />
      </div>
    `,
  }),
}
