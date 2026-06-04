import type { Meta, StoryObj } from '@storybook/vue3'
import FTSectionHeading from './FTSectionHeading.vue'

const meta: Meta<typeof FTSectionHeading> = {
  title: 'UI/FTSectionHeading',
  component: FTSectionHeading,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTSectionHeading>

export const Default: Story = {
  args: {},
  render: (args) => ({ components: { FTSectionHeading }, setup: () => ({ args }), template: '<FTSectionHeading v-bind="args">Filtros</FTSectionHeading>' }),
}

