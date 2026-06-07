import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTReportForm from './FTReportForm.vue'

describe('FTReportForm', () => {
  it('renders form fields', () => {
    const wrapper = mountFT(FTReportForm)

    expect(wrapper.find('[data-testid="report-form-fields"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="report-type-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="report-date-picker"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="report-description"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="report-email-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="report-submit-button"]').exists()).toBe(true)
  })
})
