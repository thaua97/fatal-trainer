import type { Meta, StoryObj } from '@storybook/vue3'
import FTAdminUsersListView from './FTAdminUsersListView.vue'

const meta: Meta<typeof FTAdminUsersListView> = {
  title: 'Composite/Admin/FTAdminUsersListView',
  component: FTAdminUsersListView,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTAdminUsersListView>

export const Default: Story = {
  args: {
    items: [{
      id: '1',
      name: 'Carlos Personal',
      email: 'personal@fataltrainer.com',
      role: 'personal-trainer',
      phoneNumber: '53991625225',
      city: 'Pelotas',
      state: 'RS',
      servicePrice: 100,
      isActive: true,
      featured: false,
      createdAt: '2026-06-06T00:00:00.000Z',
    }],
    roleLabel: {
      student: 'Aluno',
      'personal-trainer': 'Personal',
      admin: 'Admin',
    },
  },
}
