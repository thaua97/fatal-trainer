import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAuthRoleSelector from '@/components/ui/FTAuthRoleSelector/FTAuthRoleSelector.vue'

describe('FTAuthRoleSelector', () => {
  it('renders both role options', () => {
    const wrapper = mountFT(FTAuthRoleSelector, {
      props: {
        modelValue: 'student',
      },
    })

    expect(wrapper.find('[data-testid="auth-role-student"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="auth-role-personal-trainer"]').exists()).toBe(true)
  })

  it('emits updated role when personal trainer is selected', async () => {
    const wrapper = mountFT(FTAuthRoleSelector, {
      props: {
        modelValue: 'student',
        'onUpdate:modelValue': (value: string) => wrapper.setProps({ modelValue: value }),
      },
    })

    await wrapper.find('[data-testid="auth-role-personal-trainer"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['personal-trainer'])
  })
})
