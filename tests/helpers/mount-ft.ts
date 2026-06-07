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
    name: 'NuxtLink',
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
  UCheckbox: {
    props: ['modelValue', 'label'],
    emits: ['update:modelValue'],
    template: '<label><input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" /><span>{{ label }}</span></label>',
  },
  USkeleton: { template: '<span class="u-skeleton-stub" />' },
  UDropdownMenu: { template: '<div><slot /></div>' },
  UPopover: { template: '<div><slot /><slot name="content" /></div>' },
  UCalendar: { template: '<div class="u-calendar-stub" />' },
  USelectMenu: { template: '<select data-testid="report-trainer-select-stub" />' },
  UTextarea: { template: '<textarea data-testid="report-description" />' },
  UAlert: { template: '<div data-testid="u-alert-stub"><slot name="actions" /></div>', props: ['title', 'description'] },
  FTDatePicker: { template: '<input data-testid="report-date-picker" />' },
  FTTrainerSelectMenu: { template: '<select data-testid="report-trainer-select" />' },
  FTAvatar: { template: '<span class="ft-avatar-stub" />', props: ['src', 'name', 'size'] },
  UCarousel: {
    props: ['items'],
    template: '<div data-testid="u-carousel-stub"><slot v-for="(item, index) in items" :key="index" :item="item" :index="index" /></div>',
  },
  UTabs: {
    props: ['items', 'modelValue'],
    template: '<div data-testid="u-tabs-stub"><slot name="info" /><slot name="gallery" /><slot name="promotion" /></div>',
  },
  UCheckbox: {
    props: ['modelValue', 'label'],
    emits: ['update:modelValue'],
    template: '<label><input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" /><span>{{ label }}</span></label>',
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
      components: {
        NuxtLink: defaultStubs.NuxtLink,
        ...(options?.global?.components ?? {}),
      },
      ...options?.global,
    },
  })
}
