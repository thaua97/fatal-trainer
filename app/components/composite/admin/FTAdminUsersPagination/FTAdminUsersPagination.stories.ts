import type { Meta, StoryObj } from '@storybook/vue3'
import FTAdminUsersPagination from './FTAdminUsersPagination.vue'

const meta: Meta<typeof FTAdminUsersPagination> = {
  title: 'Composite/Admin/FTAdminUsersPagination',
  component: FTAdminUsersPagination,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTAdminUsersPagination>

export const Default: Story = {
  args: {
    page: 1,
    total: 45,
    pageSize: 10,
  },
}

export const SinglePage: Story = {
  args: {
    page: 1,
    total: 6,
    pageSize: 10,
  },
}

export const LastPage: Story = {
  args: {
    page: 5,
    total: 45,
    pageSize: 10,
  },
}
