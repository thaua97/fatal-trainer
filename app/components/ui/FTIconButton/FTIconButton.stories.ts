import type { Meta, StoryObj } from '@storybook/vue3'
import FTIconButton from './FTIconButton.vue'

const meta: Meta<typeof FTIconButton> = {
  title: 'UI/FTIconButton',
  component: FTIconButton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTIconButton>

export const Default: Story = {
  args: {ariaLabel:"Voltar"},
  render: (args) => ({ components: { FTIconButton }, setup: () => ({ args }), template: '<FTIconButton v-bind="args"><span>←</span></FTIconButton>' }),
}

