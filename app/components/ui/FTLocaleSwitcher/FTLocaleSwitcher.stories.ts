import type { Meta, StoryObj } from '@storybook/vue3'
import FTLocaleSwitcher from './FTLocaleSwitcher.vue'

const meta: Meta<typeof FTLocaleSwitcher> = {
  title: 'UI/FTLocaleSwitcher',
  component: FTLocaleSwitcher,
}

export default meta
type Story = StoryObj<typeof FTLocaleSwitcher>

export const Default: Story = {}
