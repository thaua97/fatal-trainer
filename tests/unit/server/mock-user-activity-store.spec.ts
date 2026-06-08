import { describe, expect, it, beforeEach } from 'vitest'
import {
  appendActivity,
  listUserActivity,
  resetActivityStore,
} from '../../../server/mocks/mock-user-activity-store'

describe('mock-user-activity-store', () => {
  beforeEach(() => {
    resetActivityStore()
  })

  it('appends and lists activity for a user', () => {
    appendActivity({
      userId: 'user-1',
      type: 'account_login',
      title: 'Login realizado',
    })
    appendActivity({
      userId: 'user-1',
      type: 'profile_info_edit',
      title: 'Perfil editado',
      changes: [
        { field: 'name', label: 'Nome', before: 'Ana', after: 'Ana Silva' },
      ],
    })
    appendActivity({
      userId: 'user-2',
      type: 'account_register',
      title: 'Conta criada',
    })

    const result = listUserActivity('user-1', 1, 10)

    expect(result.total).toBe(2)
    expect(result.items).toHaveLength(2)
    expect(result.items[0]?.type).toBe('profile_info_edit')
    expect(result.items[1]?.type).toBe('account_login')
  })

  it('paginates activity results', () => {
    for (let i = 0; i < 5; i++) {
      appendActivity({
        userId: 'user-1',
        type: 'account_login',
        title: `Login ${i}`,
      })
    }

    const page1 = listUserActivity('user-1', 1, 2)
    const page2 = listUserActivity('user-1', 2, 2)

    expect(page1.items).toHaveLength(2)
    expect(page1.hasMore).toBe(true)
    expect(page2.items).toHaveLength(2)
    expect(page2.hasMore).toBe(true)
  })
})
