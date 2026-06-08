<script setup lang="ts">
defineProps<{
  title: string
}>()

const route = useRoute()
const { t } = useI18n()
const { user, logout } = useAdminAuth()
const { items: recentAccessItems, pending: recentAccessPending } = useFTAdminRecentAccess()

const roleLabel = computed(() => ({
  student: t('admin.errors.roles.student'),
  'personal-trainer': t('admin.errors.roles.personal-trainer'),
  admin: t('admin.errors.roles.admin'),
}))

const navItems = [
  { label: 'Usuários', to: '/admin/usuarios', icon: 'i-lucide-users' },
  { label: 'Promoções', to: '/admin/promocoes', icon: 'i-lucide-badge-percent' },
  { label: 'Denúncias', to: '/admin/denuncias', icon: 'i-lucide-flag' },
]
</script>

<template>
  <UDashboardGroup
    storage-key="ft-admin"
    unit="rem"
    class="bg-slate-50"
  >
    <UDashboardSidebar
      id="main"
      collapsible
      :default-size="16"
      :min-size="14"
      :max-size="22"
      :collapsed-size="3.75"
      class="border-r border-slate-200/80 bg-white"
      :ui="{ root: 'overflow-x-hidden', body: 'overflow-x-hidden' }"
    >
      <template #header="{ collapsed }">
        <div
          class="flex items-center gap-3 px-2 py-1"
          :class="collapsed ? 'justify-center' : ''"
        >
          <FTLogo size="sm" />
          <span
            v-if="!collapsed"
            class="font-display text-sm font-bold text-slate-900"
          >
            Admin
          </span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <nav
          class="flex flex-col gap-1 px-2"
          :class="collapsed ? 'items-center' : ''"
        >
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center rounded-xl text-sm font-medium transition-colors"
            :class="[
              collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
              route.path.startsWith(item.to)
                ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100',
            ]"
            :title="collapsed ? item.label : undefined"
          >
            <UIcon
              :name="item.icon"
              class="size-4 shrink-0"
            />
            <span v-if="!collapsed">{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <FTAdminRecentAccessList
          v-if="!collapsed"
          :items="recentAccessItems"
          :pending="recentAccessPending"
          :role-label="roleLabel"
          @select="(item) => navigateTo(`/admin/usuarios/${item.targetUserId}`)"
        />
      </template>

      <template #footer="{ collapsed }">
        <div
          class="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
          :class="collapsed ? 'justify-center' : ''"
        >
          <UAvatar
            :alt="user?.name"
            size="sm"
            icon="i-lucide-shield"
          />
          <div
            v-if="!collapsed"
            class="min-w-0 flex-1"
          >
            <p class="truncate text-sm font-semibold text-slate-900">
              {{ user?.name }}
            </p>
            <p class="truncate text-xs text-slate-500">
              {{ user?.email }}
            </p>
          </div>
          <UButton
            variant="ghost"
            color="neutral"
            size="xs"
            icon="i-lucide-log-out"
            aria-label="Sair"
            :class="collapsed ? '' : 'shrink-0'"
            @click="logout"
          />
        </div>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <FTGradientOrbs variant="panel" />

      <UDashboardNavbar :title="title">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <div class="relative p-4 sm:p-6">
        <slot />
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<style scoped>
:deep([data-slot="root"][id*="sidebar"]) {
  width: var(--width);
  max-width: 100%;
}
</style>
