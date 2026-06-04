import type { Meta, StoryObj } from '@storybook/vue3'
import FTBackLink from './FTBackLink.vue'

const meta: Meta<typeof FTBackLink> = {
  title: 'UI/FTBackLink',
  component: FTBackLink,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTBackLink>

export const Default: Story = {
  args: {},

}

