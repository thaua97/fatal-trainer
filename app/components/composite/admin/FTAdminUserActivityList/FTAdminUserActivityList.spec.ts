import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminUserActivityList from './FTAdminUserActivityList.vue'

const activityData = {
  items: [
    {
      id: 'act-1',
      userId: 'user-1',
      type: 'profile_info_edit' as const,
      title: 'Perfil editado',
      changes: [
        { field: 'name', label: 'Nome', before: 'Ana', after: 'Ana Silva' },
      ],
      createdAt: '2026-06-01T00:00:00.000Z',
    },
  ],
  total: 1,
  page: 1,
  pageSize: 8,
  hasMore: false,
}

describe('FTAdminUserActivityList', () => {
  it('renders activity items and expandable changes', async () => {
    const wrapper = mountFT(FTAdminUserActivityList, {
      props: {
        data: activityData,
        page: 1,
      },
    })

    expect(wrapper.find('[data-testid="admin-user-activity-list"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Perfil editado')

    await wrapper.find('button[aria-label="Ver alterações"]').trigger('click')
    expect(wrapper.find('[data-testid="activity-changes"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Ana Silva')
  })
})
