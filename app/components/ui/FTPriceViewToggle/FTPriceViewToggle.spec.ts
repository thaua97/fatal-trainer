import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import FTPriceViewToggle from './FTPriceViewToggle.vue'

const mockSelect = vi.fn()

vi.mock('../../../composables/components/useFTPriceViewFilter', () => ({
  useFTPriceViewFilter: () => ({
    options: ref([
      { value: 'session', label: 'Por sessão' },
      { value: 'monthly', label: 'Mensal' },
    ]),
    isSelected: (value: string) => value === 'session',
    select: mockSelect,
  }),
}))

describe('FTPriceViewToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders session and monthly options', () => {
    const wrapper = mountFT(FTPriceViewToggle)

    expect(wrapper.find('[data-testid="price-view-toggle"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="price-view-filter-session"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="price-view-filter-monthly"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Por sessão')
    expect(wrapper.text()).toContain('Mensal')
  })

  it('selects price view on click', async () => {
    const wrapper = mountFT(FTPriceViewToggle)

    await wrapper.find('[data-testid="price-view-filter-monthly"]').trigger('click')

    expect(mockSelect).toHaveBeenCalledWith('monthly')
  })
})
