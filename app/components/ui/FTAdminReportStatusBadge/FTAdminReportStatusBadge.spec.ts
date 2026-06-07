import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminReportStatusBadge from './FTAdminReportStatusBadge.vue'

describe('FTAdminReportStatusBadge', () => {
  it('renders status label', () => {
    const wrapper = mountFT(FTAdminReportStatusBadge, {
      props: { status: 'pending', label: 'Pendente' },
    })
    expect(wrapper.text()).toContain('Pendente')
  })
})
