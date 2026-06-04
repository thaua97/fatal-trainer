import { mount, type ComponentMountingOptions } from '@vue/test-utils'
import type { Component } from 'vue'
import { createI18n } from 'vue-i18n'
import { testI18nMessages } from './i18n-test-messages'

const i18n = createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages: testI18nMessages as Record<string, Record<string, unknown>>,
})

const defaultStubs = {
  NuxtLink: {
    template: '<a :href="typeof to === \'string\' ? to : \'#\'"><slot /></a>',
    props: ['to'],
  },
  UIcon: { template: '<span class="u-icon-stub" />' },
  UButton: { template: '<button><slot /></button>' },
  UInput: { template: '<input />' },
  USelect: { template: '<select />' },
  UFormField: { template: '<div><slot /></div>' },
  UDrawer: { template: '<div><slot name="body" /><slot name="footer" /></div>' },
  UBadge: { template: '<span class="u-badge-stub"><slot /></span>' },
  USkeleton: { template: '<span class="u-skeleton-stub" />' },
  UDropdownMenu: { template: '<div><slot /></div>' },
  UCarousel: {
    props: ['items'],
    template: '<div data-testid="u-carousel-stub"><slot v-for="(item, index) in items" :key="index" :item="item" :index="index" /></div>',
  },
}

export function mountFT<T extends Component>(
  component: T,
  options?: ComponentMountingOptions<T>,
) {
  return mount(component, {
    ...options,
    global: {
      plugins: [i18n, ...(options?.global?.plugins ?? [])],
      stubs: {
        ...defaultStubs,
        ...options?.global?.stubs,
      },
      ...options?.global,
    },
  })
}
