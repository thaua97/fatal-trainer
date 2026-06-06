import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Report, ReportPayload } from '#shared/domain/report/entities/report'
import type { CreateReportResponse } from '#shared/types/api'

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

  return {
    id: report.id,
    createdAt: report.createdAt,
  }
}
