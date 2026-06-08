<script setup lang="ts">
import type { AdminUserListItem } from '#shared/types/admin'
import { formatAdminLocation, formatAdminPhone } from '#shared/utils/format-admin-user'
import { buildWhatsAppUrl, formatBrazilianPhoneForWhatsApp } from '#shared/utils/whatsapp'

const props = defineProps<{
  user: AdminUserListItem
  roleLabel: string
  x: number
  y: number
}>()

const {
  sessionPrice,
  monthlyPrice,
  sessionPromoPrice,
  monthlyPromoPrice,
  hasPricing,
} = useFTAdminUserPricing(toRef(props, 'user'))
const phoneDisplay = computed(() => formatAdminPhone(props.user.phoneNumber))
const locationDisplay = computed(() => formatAdminLocation(props.user))

const whatsAppUrl = computed(() => {
  const digits = formatBrazilianPhoneForWhatsApp(props.user.phoneNumber ?? '')
  if (!digits) return null
  return buildWhatsAppUrl(digits, `Olá ${props.user.name},`)
})

const cardStyle = computed(() => {
  const maxTop = import.meta.client ? window.innerHeight - 420 : props.y + 12
  const maxLeft = import.meta.client ? window.innerWidth - 320 : props.x + 16
  return {
    top: `${Math.min(props.y + 12, maxTop)}px`,
    left: `${Math.min(props.x + 16, maxLeft)}px`,
  }
})
</script>

<template>
  <article
    class="pointer-events-none fixed z-50 w-72 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-sm"
    :style="cardStyle"
    data-testid="admin-user-preview-card"
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
      <div class="flex items-start justify-between gap-2">
        <UAvatar
          :src="user.avatarUrl"
          :alt="user.name"
          size="lg"
          class="-mt-8 ring-4 ring-white"
        />
        <div
          v-if="phoneDisplay"
          class="mt-1 flex gap-2"
        >
          <a
            v-if="whatsAppUrl"
            :href="whatsAppUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="pointer-events-auto flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-emerald-600 shadow-sm"
            aria-label="WhatsApp"
          >
            <UIcon
              name="i-lucide-message-circle"
              class="size-4"
            />
          </a>
        </div>
      </div>

      <h3 class="mt-2 font-display text-lg font-bold text-slate-900">
        {{ user.name }}
      </h3>
      <p class="text-sm text-slate-500">
        {{ user.email }}
      </p>

      <dl class="mt-4 space-y-2.5 text-sm">
        <div
          v-if="phoneDisplay"
          class="flex items-center gap-2"
        >
          <UIcon
            name="i-lucide-phone"
            class="size-4 shrink-0 text-slate-400"
          />
          <dd class="font-medium text-slate-800">
            {{ phoneDisplay }}
          </dd>
        </div>
        <div
          v-if="locationDisplay"
          class="flex items-center gap-2"
        >
          <UIcon
            name="i-lucide-map-pin"
            class="size-4 shrink-0 text-slate-400"
          />
          <dd class="font-medium text-slate-800">
            {{ locationDisplay }}
          </dd>
        </div>
        <div
          v-if="user.availability"
          class="flex items-center gap-2"
        >
          <UIcon
            name="i-lucide-clock"
            class="size-4 shrink-0 text-slate-400"
          />
          <dd class="text-slate-700">
            {{ user.availability }}
          </dd>
        </div>
        <div
          v-if="hasPricing"
          class="flex items-start gap-2"
        >
          <UIcon
            name="i-lucide-wallet"
            class="mt-0.5 size-4 shrink-0 text-slate-400"
          />
          <dd class="space-y-1">
            <FTPriceLabel
              v-if="sessionPrice != null"
              :price="sessionPrice"
              :promo-price="sessionPromoPrice"
              price-view="session"
              size="md"
            />
            <FTPriceLabel
              v-if="monthlyPrice != null"
              :price="monthlyPrice"
              :promo-price="monthlyPromoPrice"
              price-view="monthly"
              size="md"
            />
          </dd>
        </div>
        <div class="flex items-center justify-between gap-3 border-t border-slate-100 pt-2">
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
          class="flex items-center justify-between gap-3"
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
  </article>
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
