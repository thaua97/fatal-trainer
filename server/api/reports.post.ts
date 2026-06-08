import type { ReportPayload } from '#shared/domain/report/entities/report'
import { validateReport } from '#shared/domain/report/services/validate-report'
import type { CreateReportRequest } from '#shared/types/api'
import { createReport } from '../services/report-repository'
import { findTrainerById } from '../services/trainer-repository'
import { throwValidationError } from '../utils/api-error'

function toReportPayload(body: CreateReportRequest): ReportPayload {
  return {
    type: body.type as ReportPayload['type'],
    occurredAt: body.occurredAt ?? '',
    trainerId: body.trainerId ?? '',
    description: body.description ?? '',
    contactEmail: body.contactEmail ?? '',
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateReportRequest>(event)
  const payload = toReportPayload(body)

  const trainerExists = payload.trainerId
    ? Boolean(findTrainerById(payload.trainerId))
    : undefined

  const validation = validateReport(payload, { trainerExists })

  if (!validation.valid) {
    throwValidationError(validation.errors)
  }

  const result = createReport(payload)

  setResponseStatus(event, 201)
  return result
})
