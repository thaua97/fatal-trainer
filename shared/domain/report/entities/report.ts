export type ReportType =
  | 'abuse'
  | 'offense'
  | 'wrong_pricing'
  | 'fake_profile'
  | 'harassment'
  | 'spam'
  | 'other'

export interface Report {
  id: string
  type: ReportType
  occurredAt: string
  trainerId: string
  description: string
  contactEmail: string
  createdAt: string
}

export interface ReportPayload {
  type: ReportType | ''
  occurredAt: string
  trainerId: string
  description: string
  contactEmail: string
}

export type ReportField = keyof ReportPayload

export interface ReportValidationErrors {
  type?: string
  occurredAt?: string
  trainerId?: string
  description?: string
  contactEmail?: string
}

export interface ReportValidationResult {
  valid: boolean
  errors: ReportValidationErrors
}
