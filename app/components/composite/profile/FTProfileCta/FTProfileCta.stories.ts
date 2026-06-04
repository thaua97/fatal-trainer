import type { Meta, StoryObj } from '@storybook/vue3'
import FTProfileCta from './FTProfileCta.vue'

const meta: Meta<typeof FTProfileCta> = {
  title: 'Composite/FTProfileCta',
  component: FTProfileCta,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTProfileCta>

export const Default: Story = {}
