import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import { useProfileHireModal } from '~/composables/profile/useProfileHireModal'

const isAuthenticated = ref(false)
const initialized = ref(true)
const user = ref<{ name: string } | null>(null)

vi.mock('~/composables/auth/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated,
    initialized,
    user,
  }),
}))

const TestHarness = defineComponent({
  setup() {
    const trainer = ref(mockTrainer())
    return {
      ...useProfileHireModal(trainer),
      trainer,
    }
  },
  template: '<div />',
})

describe('useProfileHireModal', () => {
  beforeEach(() => {
    vi.stubGlobal('open', vi.fn())
    isAuthenticated.value = false
    initialized.value = true
    user.value = null
    useState('profile-hire-modal-open', () => false).value = false
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('opens and closes the modal', async () => {
    const wrapper = mountFT(TestHarness)

    expect(wrapper.vm.modalOpen).toBe(false)

    wrapper.vm.openModal()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.modalOpen).toBe(true)

    wrapper.vm.closeModal()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.modalOpen).toBe(false)
  })

  it('shows login CTA for guests', () => {
    const wrapper = mountFT(TestHarness)

    expect(wrapper.vm.showLoginCta).toBe(true)
    expect(wrapper.vm.showContactCta).toBe(false)
  })

  it('shows contact CTA for authenticated users', async () => {
    isAuthenticated.value = true
    user.value = { name: 'João Aluno' }

    const wrapper = mountFT(TestHarness)

    expect(wrapper.vm.showContactCta).toBe(true)
    expect(wrapper.vm.showLoginCta).toBe(false)
  })

  it('builds login path with redirect', () => {
    const wrapper = mountFT(TestHarness)

    expect(wrapper.vm.loginPath).toContain('/login?redirect=')
  })

  it('opens WhatsApp and closes modal on handleContact when authenticated', async () => {
    isAuthenticated.value = true
    user.value = { name: 'João Aluno' }

    const wrapper = mountFT(TestHarness)
    wrapper.vm.openModal()
    await wrapper.vm.$nextTick()

    wrapper.vm.handleContact()

    expect(wrapper.vm.modalOpen).toBe(false)
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/5511999998888?text='),
      '_blank',
      'noopener,noreferrer',
    )
  })

  it('does not open WhatsApp when phone is invalid', async () => {
    isAuthenticated.value = true
    user.value = { name: 'João Aluno' }

    const wrapper = mountFT(TestHarness)
    wrapper.vm.trainer = mockTrainer({ contactPhone: undefined })
    await wrapper.vm.$nextTick()

    wrapper.vm.handleContact()

    expect(window.open).not.toHaveBeenCalled()
  })

  it('does not open modal when phone is invalid', async () => {
    const wrapper = mountFT(TestHarness)
    wrapper.vm.trainer = mockTrainer({ contactPhone: undefined })
    await wrapper.vm.$nextTick()

    wrapper.vm.openModal()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.modalOpen).toBe(false)
  })

  it('does not open modal when trainer is inactive', async () => {
    const wrapper = mountFT(TestHarness)
    wrapper.vm.trainer = mockTrainer({ isActive: false })
    await wrapper.vm.$nextTick()

    wrapper.vm.openModal()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.modalOpen).toBe(false)
  })
})
