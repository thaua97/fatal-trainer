// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FTAppHeaderUserMenu from './FTAppHeaderUserMenu.vue'

describe('FTAppHeaderUserMenu', () => {
  it('renders user menu trigger with avatar and name', async () => {
    const wrapper = await mountSuspended(FTAppHeaderUserMenu, {
      route: '/',
    })

    expect(wrapper.find('[data-testid="app-header-user-menu"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="app-header-user-menu"]').text()).not.toBe('')
  })

  it('renders compact trigger with avatar only', async () => {
    const wrapper = await mountSuspended(FTAppHeaderUserMenu, {
      route: '/',
      props: { compact: true },
    })

    const trigger = wrapper.find('[data-testid="app-header-user-menu"]')
    expect(trigger.exists()).toBe(true)
    expect(trigger.text()).not.toContain('Thauã Borges')
  })
})
