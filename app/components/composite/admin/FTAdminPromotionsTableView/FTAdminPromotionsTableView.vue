<script setup lang="ts">
import type { AdminPromotionTemplateListItem } from '#shared/types/admin'
import { formatPromotionPeriod } from '#shared/utils/promotion-template-status'

defineProps<{
  items: AdminPromotionTemplateListItem[]
  actionPending?: boolean
}>()

const emit = defineEmits<{
  edit: [AdminPromotionTemplateListItem]
  delete: [AdminPromotionTemplateListItem]
  toggleActive: [AdminPromotionTemplateListItem]
}>()
</script>

<template>
  <div
    class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm"
    data-testid="admin-promotions-table-view"
  >
    <table class="w-full text-left text-sm">
      <thead class="border-b border-slate-100 bg-slate-50/80">
        <tr>
          <th class="px-4 py-3 font-semibold text-slate-600">
            Nome
          </th>
          <th class="hidden px-4 py-3 font-semibold text-slate-600 md:table-cell">
            Label
          </th>
          <th class="px-4 py-3 font-semibold text-slate-600">
            Desconto
          </th>
          <th class="hidden px-4 py-3 font-semibold text-slate-600 lg:table-cell">
            Período
          </th>
          <th class="hidden px-4 py-3 font-semibold text-slate-600 xl:table-cell">
            Limite
          </th>
          <th class="px-4 py-3 font-semibold text-slate-600">
            Status
          </th>
          <th class="px-4 py-3 font-semibold text-slate-600">
            Ativações
          </th>
          <th class="px-4 py-3 font-semibold text-slate-600">
            Habilitada
          </th>
          <th class="px-4 py-3 font-semibold text-slate-600">
            Ações
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="promotion in items"
          :key="promotion.id"
          class="border-b border-slate-50"
        >
          <td class="px-4 py-3">
            <p class="font-semibold text-slate-900">
              {{ promotion.name }}
            </p>
            <p class="text-xs text-slate-500 md:hidden">
              {{ promotion.label }}
            </p>
          </td>
          <td class="hidden px-4 py-3 text-slate-600 md:table-cell">
            {{ promotion.label }}
          </td>
          <td class="px-4 py-3 font-medium text-violet-700">
            {{ promotion.discountPercent }}%
          </td>
          <td class="hidden px-4 py-3 text-slate-600 lg:table-cell">
            {{ formatPromotionPeriod(promotion.startsAt, promotion.endsAt) }}
          </td>
          <td class="hidden px-4 py-3 text-slate-600 xl:table-cell">
            {{ promotion.maxRedemptions ?? 'Ilimitado' }}
          </td>
          <td class="px-4 py-3">
            <FTAdminPromotionStatusBadge
              :is-active="promotion.isActive"
              :starts-at="promotion.startsAt"
              :ends-at="promotion.endsAt"
            />
          </td>
          <td class="px-4 py-3 text-slate-600 tabular-nums">
            {{ promotion.activationCount }}
          </td>
          <td class="px-4 py-3">
            <USwitch
              :model-value="promotion.isActive"
              :disabled="actionPending"
              aria-label="Habilitada"
              @update:model-value="emit('toggleActive', promotion)"
            />
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-1">
              <UButton
                variant="ghost"
                color="neutral"
                size="xs"
                icon="i-lucide-pencil"
                aria-label="Editar promoção"
                @click="emit('edit', promotion)"
              />
              <UButton
                variant="ghost"
                color="error"
                size="xs"
                icon="i-lucide-trash-2"
                :disabled="actionPending || promotion.activationCount > 0"
                aria-label="Excluir promoção"
                @click="emit('delete', promotion)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
