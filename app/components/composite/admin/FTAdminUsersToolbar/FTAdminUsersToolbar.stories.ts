import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import FTAdminUsersToolbar from './FTAdminUsersToolbar.vue'

const meta: Meta<typeof FTAdminUsersToolbar> = {
  title: 'Composite/Admin/FTAdminUsersToolbar',
  component: FTAdminUsersToolbar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTAdminUsersToolbar>

export const Default: Story = {
  render: () => ({
    components: { FTAdminUsersToolbar },
    setup() {
      const viewMode = ref<'table' | 'list'>('table')
      const sortBy = ref<'name' | 'createdAt' | 'role'>('createdAt')
      const sortOrder = ref<'asc' | 'desc'>('desc')
      const filterOpen = ref(false)
      const query = ref({ search: '', page: 1, pageSize: 20, role: undefined, isActive: undefined })
      return { viewMode, sortBy, sortOrder, filterOpen, query }
    },
    template: `
      <FTAdminUsersToolbar
        v-model:view-mode="viewMode"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        v-model:filter-open="filterOpen"
        v-model:query="query"
        :active-filter-count="0"
      />
    `,
  }),
}
