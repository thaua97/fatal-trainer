import {
  isValidEmail,
  REPORT_DESCRIPTION_MIN_LENGTH,
} from '../constants/report-options'
import type {
  ReportPayload,
  ReportValidationErrors,
  ReportValidationResult,
} from '../entities/report'

function parseDateOnly(value: string): Date | null {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year
    || date.getMonth() !== month - 1
    || date.getDate() !== day
  ) {
    return null
  }

  return date
}

function startOfToday(): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export function validateReport(
  payload: ReportPayload,
  options: { trainerExists?: boolean } = {},
): ReportValidationResult {
  const errors: ReportValidationErrors = {}

  if (!payload.type) {
    errors.type = 'required'
  }

  if (!payload.occurredAt.trim()) {
    errors.occurredAt = 'required'
  } else {
    const occurredDate = parseDateOnly(payload.occurredAt)
    if (!occurredDate) {
      errors.occurredAt = 'invalid'
    } else if (occurredDate > startOfToday()) {
      errors.occurredAt = 'future'
    }
  }

  if (!payload.trainerId.trim()) {
    errors.trainerId = 'required'
  } else if (options.trainerExists === false) {
    errors.trainerId = 'notFound'
  }

  const description = payload.description.trim()
  if (!description) {
    errors.description = 'required'
  } else if (description.length < REPORT_DESCRIPTION_MIN_LENGTH) {
    errors.description = 'tooShort'
  }

  const email = payload.contactEmail.trim()
  if (!email) {
    errors.contactEmail = 'required'
  } else if (!isValidEmail(email)) {
    errors.contactEmail = 'invalid'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
