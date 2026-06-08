<script setup lang="ts">
import type { AdminUserListItem } from '#shared/types/admin'

defineProps<{
  user: AdminUserListItem
  roleLabel: string
}>()
</script>

<template>
  <div
    class="relative w-72 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl backdrop-blur-sm"
    data-testid="admin-user-detail-popover"
  >
    <div class="relative h-20 overflow-hidden">
      <FTGradientOrbs variant="header" />
      <div :class="$style.headerGradient" />
      <div
        :class="$style.headerSparkle"
        aria-hidden="true"
      />
    </div>

    <div class="relative px-4 pb-4">
      <UAvatar
        :alt="user.name"
        size="lg"
        class="-mt-8 ring-4 ring-white"
      />
      <h3 class="mt-2 font-display text-lg font-bold text-slate-900">
        {{ user.name }}
      </h3>
      <p class="text-sm text-slate-500">
        {{ user.email }}
      </p>

      <dl class="mt-4 space-y-2 text-sm">
        <div class="flex items-center justify-between gap-3">
          <dt class="text-slate-500">
            Papel
          </dt>
          <dd>
            <FTAdminRoleBadge
              :role="user.role"
              :label="roleLabel"
              size="sm"
            />
          </dd>
        </div>
        <div class="flex items-center justify-between gap-3">
          <dt class="text-slate-500">
            Status
          </dt>
          <dd>
            <FTAdminUserStatusBadge
              :active="user.isActive"
              size="sm"
            />
          </dd>
        </div>
        <div
          v-if="user.role === 'personal-trainer'"
          class="flex justify-between"
        >
          <dt class="text-slate-500">
            Destaque
          </dt>
          <dd class="font-medium text-slate-900">
            {{ user.featured ? 'Sim' : 'Não' }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style module>
.headerGradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom right,
    rgb(139 92 246 / 0.8),
    rgb(167 139 250 / 0.7),
    rgb(56 189 248 / 0.6)
  );
}

.headerSparkle {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-image:
    radial-gradient(circle at 20% 30%, rgb(255 255 255 / 0.45) 0, transparent 45%),
    radial-gradient(circle at 80% 70%, rgb(255 255 255 / 0.25) 0, transparent 40%);
}
</style>
