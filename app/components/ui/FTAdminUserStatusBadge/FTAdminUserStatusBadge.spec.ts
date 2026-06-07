import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminUserStatusBadge from './FTAdminUserStatusBadge.vue'

describe('FTAdminUserStatusBadge', () => {
  it('renders active label', () => {
    const wrapper = mountFT(FTAdminUserStatusBadge, { props: { active: true } })
    expect(wrapper.text()).toContain('Ativo')
  })

  it('renders inactive label', () => {
    const wrapper = mountFT(FTAdminUserStatusBadge, { props: { active: false } })
    expect(wrapper.text()).toContain('Inativo')
  })
})
