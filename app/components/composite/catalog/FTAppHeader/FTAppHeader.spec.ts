// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FTAppHeader from './FTAppHeader.vue'

describe('FTAppHeader', () => {
  async function mountHeader(route = '/') {
    return mountSuspended(FTAppHeader, {
      route,
      global: {
        stubs: {
          FTLocaleSwitcher: true,
        },
      },
    })
  }

  it('renders logo linking to home', async () => {
    const wrapper = await mountHeader()
    const logo = wrapper.find('[data-testid="app-header-logo"]')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('href')).toBe('/')
  })

  it('renders desktop navigation links', async () => {
    const wrapper = await mountHeader()
    expect(wrapper.find('[data-testid="app-header-nav-trainers"]').attributes('href')).toBe('/personal-trainers')
    expect(wrapper.find('[data-testid="app-header-nav-favorites"]').attributes('href')).toBe('/personal-trainers/favoritos')
    expect(wrapper.find('[data-testid="app-header-nav-report"]').attributes('href')).toBe('/denuncia')
  })

  it('renders auth actions', async () => {
    const wrapper = await mountHeader()
    expect(wrapper.find('[data-testid="app-header-auth-register"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="app-header-auth-login"]').exists()).toBe(true)
  })

  it('renders mobile menu trigger', async () => {
    const wrapper = await mountHeader()
    expect(wrapper.find('[data-testid="app-header-menu"]').exists()).toBe(true)
  })

  it('applies blur header styles without border', async () => {
    const wrapper = await mountHeader()
    const header = wrapper.find('header')
    expect(header.classes()).toContain('backdrop-blur-md')
    expect(header.classes()).not.toContain('border-b')
  })
})
