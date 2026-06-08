import type { Meta, StoryObj } from '@storybook/vue3'
import FTProfileSection from './FTProfileSection.vue'

const meta: Meta<typeof FTProfileSection> = {
  title: 'UI/FTProfileSection',
  component: FTProfileSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTProfileSection>

export const Default: Story = {
  args: {title:"Sobre"},
  render: (args) => ({ components: { FTProfileSection }, setup: () => ({ args }), template: '<FTProfileSection v-bind="args"><p class="text-sm text-slate-600">Bio do trainer.</p></FTProfileSection>' }),
}

