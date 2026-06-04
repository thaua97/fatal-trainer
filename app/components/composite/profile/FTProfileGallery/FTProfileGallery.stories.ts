import type { Meta, StoryObj } from '@storybook/vue3'
import FTProfileGallery from './FTProfileGallery.vue'

const meta: Meta<typeof FTProfileGallery> = {
  title: 'Composite/FTProfileGallery',
  component: FTProfileGallery,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTProfileGallery>

export const Default: Story = {}
