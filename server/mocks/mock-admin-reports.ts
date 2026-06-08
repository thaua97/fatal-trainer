import type {
  AdminReportListItem,
  AdminReportListResponse,
  AdminReportsQuery,
  ReportStatus,
} from '#shared/types/admin'
import { randomUUID } from 'node:crypto'
import { findUserById, updateUserInStore } from './mock-user-store'
import { appendActivity } from './mock-user-activity-store'
import { findTrainerById, findTrainerByUserId } from '../services/trainer-repository'

interface StoredReport extends AdminReportListItem {}

const reports: StoredReport[] = []

export function listAdminReports(query: AdminReportsQuery): AdminReportListResponse {
  const page = query.page ?? 1
  const pageSize = query.pageSize ?? 20
  let items = [...reports]

  if (query.status) {
    items = items.filter(r => r.status === query.status)
  }

  if (query.type) {
    items = items.filter(r => r.type === query.type)
  }

  const total = items.length
  const start = (page - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  }
}

export function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  adminId: string,
): AdminReportListItem | null {
  const report = reports.find(r => r.id === reportId)
  if (!report) return null

  report.status = status
  if (status === 'resolved' || status === 'archived') {
    report.resolvedAt = new Date().toISOString()
    report.resolvedBy = adminId
  } else {
    report.resolvedAt = undefined
    report.resolvedBy = undefined
  }

  return { ...report }
}

export function deactivateTrainerFromReport(
  reportId: string,
  adminId: string,
): AdminReportListItem | null {
  const report = reports.find(r => r.id === reportId)
  if (!report) return null

  const trainer = findTrainerByUserId(report.trainerId) ?? findTrainerById(report.trainerId)
  const targetUserId = trainer?.userId ?? report.trainerId
  const admin = findUserById(adminId)

  updateUserInStore(targetUserId, { isActive: false })

  appendActivity({
    userId: targetUserId,
    type: 'account_deactivated',
    title: 'Conta desativada via denúncia',
    actorId: adminId,
    actorName: admin?.name,
    actorRole: admin?.role,
    metadata: { reportId },
  })

  return updateReportStatus(reportId, 'resolved', adminId)
}

export function addMockReport(report: Omit<StoredReport, 'id' | 'createdAt' | 'status'>): void {
  reports.push({
    ...report,
    id: randomUUID(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  })
}
