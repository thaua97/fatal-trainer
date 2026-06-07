<script setup lang="ts">
import type { ReportStatus } from '#shared/types/admin'

defineProps<{
  reportId: string
  status: ReportStatus
  description: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  changeStatus: [id: string, status: ReportStatus]
  deactivate: [id: string]
}>()

const detailOpen = ref(false)

function menuItems(reportId: string) {
  return [[
    {
      label: 'Em análise',
      icon: 'i-lucide-search',
      onSelect: () => emit('changeStatus', reportId, 'in_review'),
    },
    {
      label: 'Resolver',
      icon: 'i-lucide-check',
      onSelect: () => emit('changeStatus', reportId, 'resolved'),
    },
    {
      label: 'Arquivar',
      icon: 'i-lucide-archive',
      onSelect: () => emit('changeStatus', reportId, 'archived'),
    },
    {
      label: 'Desativar trainer',
      icon: 'i-lucide-user-x',
      onSelect: () => emit('deactivate', reportId),
    },
  ]]
}
</script>

<template>
  <div class="flex items-center gap-1">
    <UButton
      variant="ghost"
      color="neutral"
      size="xs"
      icon="i-lucide-eye"
      @click="detailOpen = true"
    />
    <UDropdownMenu
      :items="menuItems(reportId)"
      :disabled="disabled"
    >
      <UButton
        variant="ghost"
        color="neutral"
        size="xs"
        icon="i-lucide-ellipsis"
      />
    </UDropdownMenu>

    <UModal v-model:open="detailOpen">
      <template #content>
        <div class="p-6">
          <h3 class="font-display text-lg font-bold text-slate-900">
            Detalhe da denúncia
          </h3>
          <p class="mt-4 text-sm leading-relaxed text-slate-600">
            {{ description }}
          </p>
          <UButton
            class="mt-4 rounded-full"
            @click="detailOpen = false"
          >
            Fechar
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
