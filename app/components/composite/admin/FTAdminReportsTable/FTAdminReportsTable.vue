<script setup lang="ts">
import type { ReportStatus } from '#shared/types/admin'

const { data, pending, query, updateStatus, deactivateTrainer } = useAdminReports()
const actionPending = ref(false)

const statusLabel: Record<ReportStatus, string> = {
  pending: 'Pendente',
  in_review: 'Em análise',
  resolved: 'Resolvida',
  archived: 'Arquivada',
}

async function handleStatusChange(id: string, status: ReportStatus) {
  actionPending.value = true
  try {
    await updateStatus(id, status)
  } finally {
    actionPending.value = false
  }
}

async function handleDeactivate(id: string) {
  actionPending.value = true
  try {
    await deactivateTrainer(id)
  } finally {
    actionPending.value = false
  }
}
</script>

<template>
  <div data-testid="admin-reports-table">
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <USelect
        v-model="query.status"
        :items="[
          { label: 'Todos os status', value: undefined },
          { label: 'Pendentes', value: 'pending' },
          { label: 'Em análise', value: 'in_review' },
          { label: 'Resolvidas', value: 'resolved' },
          { label: 'Arquivadas', value: 'archived' },
        ]"
        placeholder="Status"
        class="w-44"
      />
    </div>

    <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm">
      <div
        v-if="pending"
        class="p-8 text-center text-slate-500"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-6 animate-spin"
        />
      </div>

      <FTEmptyState
        v-else-if="!data?.items.length"
        title="Nenhuma denúncia encontrada"
        variant="generic"
      />

      <table
        v-else
        class="w-full text-left text-sm"
      >
        <thead class="border-b border-slate-100 bg-slate-50/80">
          <tr>
            <th class="px-4 py-3 font-semibold text-slate-600">
              Tipo
            </th>
            <th class="px-4 py-3 font-semibold text-slate-600">
              Trainer
            </th>
            <th class="px-4 py-3 font-semibold text-slate-600">
              Status
            </th>
            <th class="px-4 py-3 font-semibold text-slate-600">
              Data
            </th>
            <th class="px-4 py-3 font-semibold text-slate-600" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="report in data.items"
            :key="report.id"
            class="border-b border-slate-50 hover:bg-violet-50/40"
          >
            <td class="px-4 py-3 font-medium text-slate-900">
              {{ report.type }}
            </td>
            <td class="px-4 py-3 text-slate-600">
              {{ report.trainerName ?? report.trainerId }}
            </td>
            <td class="px-4 py-3">
              <FTAdminReportStatusBadge
                :status="report.status"
                :label="statusLabel[report.status]"
              />
            </td>
            <td class="px-4 py-3 text-slate-500">
              {{ new Date(report.createdAt).toLocaleDateString('pt-BR') }}
            </td>
            <td class="px-4 py-3">
              <FTAdminReportActions
                :report-id="report.id"
                :status="report.status"
                :description="report.description"
                :disabled="actionPending"
                @change-status="handleStatusChange"
                @deactivate="handleDeactivate"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
