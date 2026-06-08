import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import FTRatingInput from './FTRatingInput.vue'

const meta: Meta<typeof FTRatingInput> = {
  title: 'UI/FTRatingInput',
  component: FTRatingInput,
}

export default meta
type Story = StoryObj<typeof FTRatingInput>

export const Default: Story = {
  render: () => ({
    components: { FTRatingInput },
    setup() {
      const rating = ref(3.5)
      return { rating }
    },
    template: '<FTRatingInput v-model="rating" />',
  }),
}

export const Readonly: Story = {
  render: () => ({
    components: { FTRatingInput },
    setup() {
      const rating = ref(4)
      return { rating }
    },
    template: '<FTRatingInput v-model="rating" readonly />',
  }),
}
