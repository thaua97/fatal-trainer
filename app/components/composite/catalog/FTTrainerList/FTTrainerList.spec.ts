import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mountFT } from '../../../../../tests/helpers/mount-ft'
import FTTrainerList from './FTTrainerList.vue'

const mockUseFTTrainerList = vi.fn()

vi.mock('../../../../composables/components/useFTTrainerList', () => ({
  useFTTrainerList: () => mockUseFTTrainerList(),
}))

describe('FTTrainerList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows skeletons while loading', () => {
    mockUseFTTrainerList.mockReturnValue({
      trainers: ref([]),
      isLoading: ref(true),
      isEmpty: ref(false),
      clearFilters: vi.fn(),
    })

    const wrapper = mountFT(FTTrainerList, {
      global: {
        stubs: {
          FTTrainerCardSkeleton: {
            template: '<div data-testid="trainer-card-skeleton" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="trainer-list-loading"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="trainer-card-skeleton"]')).toHaveLength(6)
    expect(wrapper.find('[data-testid="trainer-list-empty"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="trainer-list"]').exists()).toBe(false)
  })

  it('shows empty state when loaded with no trainers', () => {
    mockUseFTTrainerList.mockReturnValue({
      trainers: ref([]),
      isLoading: ref(false),
      isEmpty: ref(true),
      clearFilters: vi.fn(),
    })

    const wrapper = mountFT(FTTrainerList, {
      global: {
        stubs: {
          FTEmptyState: {
            template: '<div data-testid="trainer-list-empty"><slot /></div>',
          },
          UButton: { template: '<button><slot /></button>' },
        },
      },
    })

    expect(wrapper.find('[data-testid="trainer-list-loading"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="trainer-list-empty"]').exists()).toBe(true)
  })

  it('shows trainer cards when loaded with results', () => {
    mockUseFTTrainerList.mockReturnValue({
      trainers: ref([{ id: '1', name: 'Ana' }]),
      isLoading: ref(false),
      isEmpty: ref(false),
      clearFilters: vi.fn(),
    })

    const wrapper = mountFT(FTTrainerList, {
      global: {
        stubs: {
          FTTrainerCard: {
            props: ['trainer'],
            template: '<div data-testid="trainer-card" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="trainer-list-loading"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="trainer-list"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="trainer-card"]')).toHaveLength(1)
  })
})
