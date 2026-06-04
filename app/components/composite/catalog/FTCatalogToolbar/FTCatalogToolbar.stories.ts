import type { Meta, StoryObj } from '@storybook/vue3'
import FTCatalogToolbar from './FTCatalogToolbar.vue'

const meta: Meta<typeof FTCatalogToolbar> = {
  title: 'Composite/FTCatalogToolbar',
  component: FTCatalogToolbar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTCatalogToolbar>

export const Default: Story = {}
