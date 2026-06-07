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
  })
})
