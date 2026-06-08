import type { ReportType } from '../entities/report'

export interface ReportTypeOption {
  value: ReportType
  labelKey: string
}

export const REPORT_TYPE_OPTIONS: ReportTypeOption[] = [
  { value: 'abuse', labelKey: 'report.types.abuse' },
  { value: 'offense', labelKey: 'report.types.offense' },
  { value: 'wrong_pricing', labelKey: 'report.types.wrongPricing' },
  { value: 'fake_profile', labelKey: 'report.types.fakeProfile' },
  { value: 'harassment', labelKey: 'report.types.harassment' },
  { value: 'spam', labelKey: 'report.types.spam' },
  { value: 'other', labelKey: 'report.types.other' },
]

export const REPORT_DESCRIPTION_MIN_LENGTH = 20

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim())
}
