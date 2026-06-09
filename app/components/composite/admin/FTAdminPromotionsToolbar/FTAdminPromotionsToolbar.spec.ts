import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminPromotionsToolbar from './FTAdminPromotionsToolbar.vue'

describe('FTAdminPromotionsToolbar', () => {
  it('renders toolbar with bounded search wrapper', () => {
    const wrapper = mountFT(FTAdminPromotionsToolbar, {
      props: {
        sortBy: 'createdAt',
        sortOrder: 'desc',
        query: { search: '', page: 1, pageSize: 20 },
        activeFilterCount: 0,
      },
    })

    expect(wrapper.find('[data-testid="admin-promotions-toolbar"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="admin-promotions-toolbar-search"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="admin-promotions-toolbar-search"]').classes()).toEqual(
      expect.arrayContaining(['lg:max-w-sm', 'xl:max-w-md']),
    )
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders harmonized action button classes', () => {
    const wrapper = mountFT(FTAdminPromotionsToolbar, {
      props: {
        sortBy: 'createdAt',
        sortOrder: 'desc',
        query: { search: '', page: 1, pageSize: 20 },
        activeFilterCount: 0,
      },
    })

    const filterButton = wrapper.findAll('button').find(button => button.text().includes('Filtros'))
    const createButton = wrapper.findAll('button').find(button => button.text().includes('Nova promoção'))

    expect(filterButton?.classes()).toEqual(expect.arrayContaining(['h-10', 'rounded-full']))
    expect(createButton?.classes()).toEqual(expect.arrayContaining(['h-10', 'rounded-full']))
  })
})
