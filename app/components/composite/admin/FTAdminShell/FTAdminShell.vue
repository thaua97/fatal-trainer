<script setup lang="ts">
defineProps<{
  title: string
}>()

const route = useRoute()
const { user, logout } = useAdminAuth()
const { items: recentAccessItems, pending: recentAccessPending } = useFTAdminRecentAccess()

const roleLabel: Record<string, string> = {
  student: 'Aluno',
  'personal-trainer': 'Personal',
  admin: 'Admin',
}

const navItems = [
  { label: 'Usuários', to: '/admin/usuarios', icon: 'i-lucide-users' },
  { label: 'Denúncias', to: '/admin/denuncias', icon: 'i-lucide-flag' },
]
</script>

<template>
  <UDashboardGroup class="relative min-h-screen overflow-hidden bg-slate-50">
    <UDashboardSidebar
      collapsible
      class="border-r border-slate-200/80 bg-white"
    >
      <template #header>
        <div class="flex items-center gap-3 px-2 py-1">
          <FTLogo size="sm" />
          <span class="font-display text-sm font-bold text-slate-900">Admin</span>
        </div>
      </template>

      <nav class="flex flex-col gap-1 px-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          :class="route.path.startsWith(item.to)
            ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100'"
        >
          <UIcon
            :name="item.icon"
            class="size-4"
          />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <FTAdminRecentAccessList
        :items="recentAccessItems"
        :pending="recentAccessPending"
        :role-label="roleLabel"
        @select="navigateTo('/admin/usuarios')"
      />

      <template #footer>
        <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
          <UAvatar
            :alt="user?.name"
            size="sm"
            icon="i-lucide-shield"
          />
          <div class="min-w-0 flex-1">
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
            @click="logout"
          />
        </div>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel class="relative overflow-hidden">
      <FTGradientOrbs variant="panel" />

      <UDashboardNavbar :title="title" class="relative">
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
