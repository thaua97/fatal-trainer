<script setup lang="ts">
import type { AdminUserListItem } from '#shared/types/admin'
import { adminService } from '~/services/admin/admin.service'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-only',
})

const route = useRoute()
const userId = computed(() => String(route.params.id))

const {
  user,
  detailPending,
  activityData,
  activityPending,
  activityPage,
  notesData,
  notesPending,
  noteSubmitting,
  error,
  roleLabel,
  submitNote,
  refreshAll,
} = useAdminUserProfile(userId)

const actionPending = ref(false)
const modalOpen = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'student' as AdminUserListItem['role'],
})

useSeoMeta({
  title: computed(() => user.value ? `${user.value.name} — Admin` : 'Perfil — Admin'),
})

function openEdit() {
  if (!user.value) return
  form.name = user.value.name
  form.email = user.value.email
  form.password = ''
  form.role = user.value.role
  modalOpen.value = true
}

async function handleSave() {
  if (!user.value) return
  actionPending.value = true
  try {
    await adminService.updateAdminUser(user.value.id, {
      name: form.name,
      email: form.email,
      role: form.role,
    })
    modalOpen.value = false
    await refreshAll()
  } finally {
    actionPending.value = false
  }
}

async function handleImpersonate() {
  if (!user.value) return
  actionPending.value = true
  try {
    await adminService.impersonateAdminUser(user.value.id)
    const { fetchMe } = useAuth()
    const { fetchAdminMe } = useAdminAuth()
    await fetchMe()
    await fetchAdminMe()
    await navigateTo('/')
  } finally {
    actionPending.value = false
  }
}
</script>

<template>
  <FTAdminShell :title="user?.name ?? 'Perfil do usuário'">
    <div
      v-if="detailPending && !user"
      class="flex justify-center py-20"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-slate-400"
      />
    </div>

    <UAlert
      v-else-if="error"
      color="error"
      variant="subtle"
      title="Usuário não encontrado"
      :description="error"
    >
      <template #actions>
        <UButton
          to="/admin/usuarios"
          variant="outline"
          color="neutral"
          size="sm"
        >
          Voltar à lista
        </UButton>
      </template>
    </UAlert>

    <template v-else-if="user">
      <FTAdminUserProfileHeader
        :user="user"
        :action-pending="actionPending"
        @edit="openEdit"
        @impersonate="handleImpersonate"
      />

      <div
        class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6"
        data-testid="admin-user-profile-grid"
      >
        <FTAdminUserProfileCard
          :user="user"
          :role-label="roleLabel"
        />
        <FTAdminUserAccountCard
          :user="user"
          :role-label="roleLabel"
        />
        <FTAdminUserActivityList
          :data="activityData"
          :pending="activityPending"
          :page="activityPage"
          @update:page="activityPage = $event"
        />
        <FTAdminUserNotesPanel
          :notes="notesData"
          :pending="notesPending"
          :submitting="noteSubmitting"
          @submit="submitNote"
        />
      </div>

      <FTAdminUserFormModal
        v-model:open="modalOpen"
        v-model:form="form"
        :editing="true"
        :pending="actionPending"
        @save="handleSave"
      />
    </template>
  </FTAdminShell>
</template>
