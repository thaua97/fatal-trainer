import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Report, ReportPayload } from '#shared/domain/report/entities/report'
import type { CreateReportResponse } from '#shared/types/api'
import { addMockReport } from '../mocks/mock-admin-store'
import { appendActivity } from '../mocks/mock-user-activity-store'
import { findTrainerById } from './trainer-repository'

const REPORTS_FILE = join(process.cwd(), 'server/data/reports.json')

function loadReports(): Report[] {
  const raw = readFileSync(REPORTS_FILE, 'utf-8')
  return JSON.parse(raw) as Report[]
}

function saveReports(reports: Report[]): void {
  writeFileSync(REPORTS_FILE, `${JSON.stringify(reports, null, 2)}\n`, 'utf-8')
}

export function createReport(payload: ReportPayload): CreateReportResponse {
  const reports = loadReports()
  const now = new Date().toISOString()

  const report: Report = {
    id: randomUUID(),
    type: payload.type as Report['type'],
    occurredAt: payload.occurredAt,
    trainerId: payload.trainerId,
    description: payload.description.trim(),
    contactEmail: payload.contactEmail.trim(),
    createdAt: now,
  }

  reports.push(report)
  saveReports(reports)

  addMockReport({
    type: report.type as 'other',
    occurredAt: report.occurredAt,
    trainerId: report.trainerId,
    description: report.description,
    contactEmail: report.contactEmail,
    trainerName: undefined,
  })

  const trainer = findTrainerById(report.trainerId)
  if (trainer?.userId) {
    appendActivity({
      userId: trainer.userId,
      type: 'report_received',
      title: 'Denúncia recebida',
      description: report.description,
      metadata: {
        reportId: report.id,
        reportType: report.type,
      },
    })
  }

  return {
    id: report.id,
    createdAt: report.createdAt,
  }
}
