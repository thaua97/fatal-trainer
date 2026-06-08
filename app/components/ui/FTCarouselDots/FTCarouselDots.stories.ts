import type { Meta, StoryObj } from '@storybook/vue3'
import FTCarouselDots from './FTCarouselDots.vue'

const meta: Meta<typeof FTCarouselDots> = {
  title: 'UI/FTCarouselDots',
  component: FTCarouselDots,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div class="rounded-2xl bg-violet-400 p-6"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof FTCarouselDots>

export const FirstActive: Story = {
  args: {
    count: 6,
    activeIndex: 0,
  },
}

export const LastActive: Story = {
  args: {
    count: 6,
    activeIndex: 5,
  },
}
