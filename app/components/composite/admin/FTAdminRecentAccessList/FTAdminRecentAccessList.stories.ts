import type { Meta, StoryObj } from '@storybook/vue3'
import FTAdminRecentAccessList from './FTAdminRecentAccessList.vue'

const meta: Meta<typeof FTAdminRecentAccessList> = {
  title: 'Composite/Admin/FTAdminRecentAccessList',
  component: FTAdminRecentAccessList,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTAdminRecentAccessList>

export const Empty: Story = {
  args: {
    items: [],
    roleLabel: { student: 'Aluno', 'personal-trainer': 'Personal', admin: 'Admin' },
  },
}

export const WithItems: Story = {
  args: {
    items: [
      {
        id: '1',
        targetUserId: 'u1',
        targetName: 'Carlos Personal',
        targetRole: 'personal-trainer',
        accessedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        targetUserId: 'u2',
        targetName: 'Ana Aluno',
        targetRole: 'student',
        accessedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    roleLabel: { student: 'Aluno', 'personal-trainer': 'Personal', admin: 'Admin' },
  },
}
