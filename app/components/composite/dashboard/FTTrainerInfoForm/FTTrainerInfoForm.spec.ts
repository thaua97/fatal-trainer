import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import FTTrainerInfoForm from './FTTrainerInfoForm.vue'

describe('FTTrainerInfoForm', () => {
  it('renders form fields when trainer is provided', () => {
    const wrapper = mountFT(FTTrainerInfoForm, {
      props: { trainer: mockTrainer() },
    })

    expect(wrapper.find('[data-testid="trainer-info-form-fields"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-info-name"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-info-submit"]').exists()).toBe(true)
  })
})
