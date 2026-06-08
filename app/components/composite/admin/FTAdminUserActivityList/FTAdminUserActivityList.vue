<script setup lang="ts">
import type { AdminUserActivityItem, AdminUserActivityListResponse, AdminUserActivityType } from '#shared/types/admin'

const props = defineProps<{
  data?: AdminUserActivityListResponse | null
  pending?: boolean
  page: number
}>()

const emit = defineEmits<{
  'update:page': [number]
}>()

const expandedIds = ref<Set<string>>(new Set())

const ACTIVITY_LABELS: Record<AdminUserActivityType, string> = {
  profile_info_edit: 'Perfil',
  profile_promotion_edit: 'Promoção',
  profile_gallery_edit: 'Galeria',
  admin_user_edit: 'Admin',
  admin_featured_toggle: 'Admin',
  admin_impersonation: 'Admin',
  account_login: 'Conta',
  account_register: 'Conta',
  account_deactivated: 'Conta',
  report_received: 'Denúncia',
}

const ACTIVITY_COLORS: Record<AdminUserActivityType, string> = {
  profile_info_edit: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  profile_promotion_edit: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  profile_gallery_edit: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  admin_user_edit: 'bg-amber-50 text-amber-700 ring-amber-200',
  admin_featured_toggle: 'bg-amber-50 text-amber-700 ring-amber-200',
  admin_impersonation: 'bg-amber-50 text-amber-700 ring-amber-200',
  account_login: 'bg-sky-50 text-sky-700 ring-sky-200',
  account_register: 'bg-sky-50 text-sky-700 ring-sky-200',
  account_deactivated: 'bg-rose-50 text-rose-700 ring-rose-200',
  report_received: 'bg-rose-50 text-rose-700 ring-rose-200',
}

function toggleExpanded(id: string) {
  const next = new Set(expandedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  expandedIds.value = next
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const totalPages = computed(() => {
  const total = props.data?.total ?? 0
  const pageSize = props.data?.pageSize ?? 8
  return Math.max(1, Math.ceil(total / pageSize))
})
</script>

<template>
  <article
    class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
    data-testid="admin-user-activity-list"
  >
    <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="font-display text-base font-bold text-slate-900">
            Atividade
          </h2>
          <UBadge
            color="primary"
            variant="subtle"
            size="sm"
          >
            {{ data?.total ?? 0 }}
          </UBadge>
        </div>
        <p class="text-xs text-slate-500">
          Histórico de ações e alterações
        </p>
      </div>
    </div>

    <div
      v-if="pending"
      class="flex justify-center py-12"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-6 animate-spin text-slate-400"
      />
    </div>

    <p
      v-else-if="!data?.items.length"
      class="px-5 py-10 text-center text-sm text-slate-400"
    >
      Nenhuma atividade registrada
    </p>

    <div
      v-else
      class="divide-y divide-slate-100"
    >
      <div
        v-for="item in data.items"
        :key="item.id"
        class="px-5 py-3.5"
      >
        <div class="flex items-start gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset"
                :class="ACTIVITY_COLORS[item.type]"
              >
                {{ ACTIVITY_LABELS[item.type] }}
              </span>
              <span class="text-xs text-slate-400">
                {{ formatDate(item.createdAt) }}
              </span>
            </div>
            <p class="mt-1 text-sm font-semibold text-slate-900">
              {{ item.title }}
            </p>
            <p
              v-if="item.description"
              class="mt-0.5 text-xs text-slate-500"
            >
              {{ item.description }}
            </p>
            <p
              v-if="item.actorName && item.actorId"
              class="mt-1 text-xs text-slate-400"
            >
              por {{ item.actorName }}
            </p>
          </div>
          <UButton
            v-if="item.changes?.length"
            variant="ghost"
            color="neutral"
            size="xs"
            :icon="expandedIds.has(item.id) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            aria-label="Ver alterações"
            @click="toggleExpanded(item.id)"
          />
        </div>

        <ul
          v-if="item.changes?.length && expandedIds.has(item.id)"
          class="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 text-xs"
          data-testid="activity-changes"
        >
          <li
            v-for="change in item.changes"
            :key="change.field"
          >
            <span class="font-semibold text-slate-600">{{ change.label }}:</span>
            <span class="text-slate-400 line-through">{{ change.before ?? '—' }}</span>
            <UIcon
              name="i-lucide-arrow-right"
              class="mx-1 inline size-3 text-slate-300"
            />
            <span class="font-medium text-slate-800">{{ change.after ?? '—' }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div
      v-if="(data?.total ?? 0) > (data?.pageSize ?? 8)"
      class="flex items-center justify-between border-t border-slate-100 px-5 py-3"
    >
      <UButton
        variant="ghost"
        color="neutral"
        size="xs"
        icon="i-lucide-chevron-left"
        :disabled="page <= 1"
        @click="emit('update:page', page - 1)"
      />
      <span class="text-xs text-slate-500">
        {{ page }} / {{ totalPages }}
      </span>
      <UButton
        variant="ghost"
        color="neutral"
        size="xs"
        icon="i-lucide-chevron-right"
        :disabled="!data?.hasMore"
        @click="emit('update:page', page + 1)"
      />
    </div>
  </article>
</template>
