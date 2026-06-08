<script setup lang="ts">
import type { AdminUserDetail } from '#shared/types/admin'
import type { UserRole } from '#shared/domain/auth/entities/user'
import { formatAdminLocation, formatAdminPhone } from '#shared/utils/format-admin-user'

const props = defineProps<{
  user: AdminUserDetail
  roleLabel: Record<UserRole, string>
}>()

const phoneDisplay = computed(() => formatAdminPhone(props.user.phoneNumber))
const locationDisplay = computed(() => formatAdminLocation(props.user))

const createdAtDisplay = computed(() => {
  return new Date(props.user.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
})
</script>

<template>
  <article
    class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
    data-testid="admin-user-profile-card"
  >
    <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <h2 class="font-display text-base font-bold text-slate-900">
        Perfil
      </h2>
    </div>

    <FTAdminProfileCardHeader />

    <div class="relative px-5 pb-5">
      <div class="flex items-start justify-between gap-3">
        <UAvatar
          :src="user.avatarUrl"
          :alt="user.name"
          size="xl"
          class="-mt-10 ring-4 ring-white"
        />
        <div class="mt-1 flex flex-wrap justify-end gap-2">
          <FTAdminRoleBadge
            :role="user.role"
            :label="roleLabel[user.role]"
            size="sm"
          />
          <FTAdminUserStatusBadge
            :active="user.isActive"
            size="sm"
          />
        </div>
      </div>

      <h3 class="mt-3 font-display text-xl font-bold text-slate-900">
        {{ user.name }}
      </h3>
      <p class="text-sm text-slate-500">
        ID {{ user.id.slice(0, 8) }}…
      </p>

      <section class="mt-5">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Contato
        </p>
        <dl class="space-y-2.5 text-sm">
          <div class="flex items-center gap-2.5">
            <div class="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <UIcon
                name="i-lucide-mail"
                class="size-4"
              />
            </div>
            <dd class="font-medium text-slate-800">
              {{ user.email }}
            </dd>
          </div>
          <div
            v-if="phoneDisplay"
            class="flex items-center gap-2.5"
          >
            <div class="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <UIcon
                name="i-lucide-phone"
                class="size-4"
              />
            </div>
            <dd class="font-medium text-slate-800">
              {{ phoneDisplay }}
            </dd>
          </div>
        </dl>
      </section>

      <section class="mt-5 border-t border-slate-100 pt-5">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Informações
        </p>
        <dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-slate-500">
              Localização
            </dt>
            <dd class="mt-0.5 font-medium text-slate-900">
              {{ locationDisplay ?? '—' }}
            </dd>
          </div>
          <div>
            <dt class="text-slate-500">
              Cadastro
            </dt>
            <dd class="mt-0.5 font-medium text-slate-900">
              {{ createdAtDisplay }}
            </dd>
          </div>
          <div
            v-if="user.role === 'personal-trainer'"
          >
            <dt class="text-slate-500">
              Destaque
            </dt>
            <dd class="mt-0.5 font-medium text-slate-900">
              {{ user.featured ? 'Sim' : 'Não' }}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  </article>
</template>
