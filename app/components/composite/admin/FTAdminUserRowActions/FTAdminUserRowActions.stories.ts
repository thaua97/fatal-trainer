import type { Meta, StoryObj } from '@storybook/vue3'
import FTAdminUserRowActions from './FTAdminUserRowActions.vue'

const meta: Meta<typeof FTAdminUserRowActions> = {
  title: 'Composite/Admin/FTAdminUserRowActions',
  component: FTAdminUserRowActions,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTAdminUserRowActions>

export const Default: Story = {
  args: {
    user: {
      id: '1',
      name: 'Carlos Personal',
      email: 'personal@fataltrainer.com',
      role: 'personal-trainer',
      isActive: true,
      featured: false,
      createdAt: '2026-06-06T00:00:00.000Z',
    },
  },
}
