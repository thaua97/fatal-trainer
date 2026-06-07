<script setup lang="ts">
import type { AdminRecentAccessItem } from '#shared/types/admin'
import { formatRelativeAccessTime } from '#shared/utils/format-admin-user'

defineProps<{
  items: AdminRecentAccessItem[]
  pending?: boolean
  roleLabel: Record<string, string>
}>()

const emit = defineEmits<{
  select: [AdminRecentAccessItem]
}>()
</script>

<template>
  <section
    class="mx-2 mt-4 border-t border-slate-100 pt-4"
    data-testid="admin-recent-access-list"
  >
    <div class="relative mb-3 overflow-hidden rounded-xl px-3 py-2">
      <div class="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-sky-400/10" />
      <p class="relative text-xs font-semibold uppercase tracking-wide text-slate-500">
        Últimos acessos
      </p>
    </div>

    <div
      v-if="pending"
      class="flex justify-center py-4"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-4 animate-spin text-slate-400"
      />
    </div>

    <p
      v-else-if="!items.length"
      class="px-3 py-2 text-xs text-slate-400"
    >
      Nenhum acesso recente
    </p>

    <ul
      v-else
      class="space-y-1 px-1"
    >
      <li
        v-for="item in items"
        :key="item.id"
      >
        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors hover:bg-slate-100"
          @click="emit('select', item)"
        >
          <UAvatar
            size="xs"
            :alt="item.targetName"
            icon="i-lucide-user"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-semibold text-slate-800">
              {{ item.targetName }}
            </p>
            <p class="truncate text-[11px] text-slate-500">
              {{ roleLabel[item.targetRole] ?? item.targetRole }}
              · {{ formatRelativeAccessTime(item.accessedAt) }}
            </p>
          </div>
        </button>
      </li>
    </ul>
  </section>
</template>
