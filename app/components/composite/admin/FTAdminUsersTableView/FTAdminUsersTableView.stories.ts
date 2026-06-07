import type { Meta, StoryObj } from '@storybook/vue3'
import FTAdminUsersTableView from './FTAdminUsersTableView.vue'

const meta: Meta<typeof FTAdminUsersTableView> = {
  title: 'Composite/Admin/FTAdminUsersTableView',
  component: FTAdminUsersTableView,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTAdminUsersTableView>

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
      promoPrice: 80,
      isActive: true,
      featured: true,
      createdAt: '2026-06-06T00:00:00.000Z',
    }],
    roleLabel: {
      student: 'Aluno',
      'personal-trainer': 'Personal',
      admin: 'Admin',
    },
  },
}
