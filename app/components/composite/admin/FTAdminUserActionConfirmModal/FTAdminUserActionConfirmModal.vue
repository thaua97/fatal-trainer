<script setup lang="ts">
import type { AdminUserConfirmAction } from '~/composables/admin/useFTAdminUserActionConfirm'

const props = defineProps<{
  action?: AdminUserConfirmAction
  userName?: string
  pending?: boolean
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ confirm: [] }>()

const { t } = useI18n()

const copy = computed(() => {
  const action = props.action ?? 'deactivate'
  const name = props.userName ?? ''

  return {
    tile: t('adminUserActionConfirm.tile'),
    title: t(`adminUserActionConfirm.${action}.title`, { name }),
    subtitle: t(`adminUserActionConfirm.${action}.subtitle`, { name }),
    confirm: t(`adminUserActionConfirm.${action}.confirm`),
    cancel: t('adminUserActionConfirm.cancel'),
  }
})

const confirmColor = computed(() => {
  if (props.action === 'delete' || props.action === 'deactivate') {
    return 'error'
  }
  if (props.action === 'activate' || props.action === 'feature') {
    return 'success'
  }
  return 'primary'
})
</script>

<template>
  <FTModal
    v-model:open="open"
    compact-on-mobile
    :tile="copy.tile"
    :title="copy.title"
    :subtitle="copy.subtitle"
    test-id="admin-user-action-confirm-modal"
    title-id="admin-user-action-confirm-title"
    :dismissible="!pending"
  >
    <div class="flex w-full flex-col gap-3">
      <UButton
        type="button"
        :color="confirmColor"
        size="xl"
        class="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-bold lg:min-h-16 lg:px-10 lg:py-4 lg:text-lg"
        data-testid="admin-user-action-confirm"
        :loading="pending"
        :disabled="pending"
        :aria-describedby="'admin-user-action-confirm-title'"
        @click="emit('confirm')"
      >
        {{ copy.confirm }}
      </UButton>

      <UButton
        type="button"
        variant="outline"
        color="neutral"
        class="w-full justify-center rounded-full px-5 py-2.5 text-sm font-bold lg:px-6 lg:py-3 lg:text-base"
        data-testid="admin-user-action-cancel"
        :disabled="pending"
        :aria-describedby="'admin-user-action-confirm-title'"
        @click="open = false"
      >
        {{ copy.cancel }}
      </UButton>
    </div>
  </FTModal>
</template>
