<script setup lang="ts">
import type { AdminUserDetail } from '#shared/types/admin'
import type { UserRole } from '#shared/domain/auth/entities/user'

const props = defineProps<{
  user: AdminUserDetail
  roleLabel: Record<UserRole, string>
}>()

const {
  sessionPrice,
  monthlyPrice,
  sessionPromoPrice,
  monthlyPromoPrice,
  hasPricing,
} = useFTAdminUserPricing(toRef(props, 'user'))
const trainer = computed(() => props.user.trainer)
</script>

<template>
  <article
    class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
    data-testid="admin-user-account-card"
  >
    <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div>
        <h2 class="font-display text-base font-bold text-slate-900">
          {{ trainer ? 'Perfil profissional' : 'Dados da conta' }}
        </h2>
        <p
          v-if="trainer"
          class="text-xs text-slate-500"
        >
          Informações do personal trainer
        </p>
      </div>
      <UBadge
        v-if="user.isActive"
        color="success"
        variant="subtle"
        size="sm"
      >
        Ativo
      </UBadge>
      <UBadge
        v-else
        color="error"
        variant="subtle"
        size="sm"
      >
        Inativo
      </UBadge>
    </div>

    <div class="p-5">
      <template v-if="trainer">
        <dl class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-slate-500">
              CREF
            </dt>
            <dd class="mt-0.5 font-medium text-slate-900">
              {{ trainer.cref || '—' }}
            </dd>
          </div>
          <div>
            <dt class="text-slate-500">
              Experiência
            </dt>
            <dd class="mt-0.5 font-medium text-slate-900">
              {{ trainer.experienceYears ? `${trainer.experienceYears} anos` : '—' }}
            </dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-slate-500">
              Especialidades
            </dt>
            <dd class="mt-1 flex flex-wrap gap-1.5">
              <UBadge
                v-for="specialty in trainer.specialties ?? []"
                :key="specialty"
                color="primary"
                variant="subtle"
                size="sm"
              >
                {{ specialty }}
              </UBadge>
              <span
                v-if="!(trainer.specialties?.length)"
                class="text-slate-400"
              >—</span>
            </dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-slate-500">
              Modalidades
            </dt>
            <dd class="mt-1 flex flex-wrap gap-1.5">
              <FTModalityBadge
                v-for="modality in trainer.modalities ?? []"
                :key="modality"
                :modality="modality"
              />
              <span
                v-if="!(trainer.modalities?.length)"
                class="text-slate-400"
              >—</span>
            </dd>
          </div>
          <div
            v-if="trainer.availability"
            class="sm:col-span-2"
          >
            <dt class="text-slate-500">
              Disponibilidade
            </dt>
            <dd class="mt-0.5 font-medium text-slate-900">
              {{ trainer.availability }}
            </dd>
          </div>
        </dl>

        <div
          v-if="hasPricing"
          class="mt-5 rounded-xl border border-violet-100 bg-violet-50/50 p-4"
        >
          <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-600">
            Preços
          </p>
          <div class="space-y-2">
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
          </div>
        </div>

        <p
          v-if="trainer.description"
          class="mt-5 text-sm leading-relaxed text-slate-600"
        >
          {{ trainer.description }}
        </p>
      </template>

      <template v-else>
        <dl class="space-y-4 text-sm">
          <div class="flex items-center justify-between gap-3">
            <dt class="text-slate-500">
              Papel
            </dt>
            <dd>
              <FTAdminRoleBadge
                :role="user.role"
                :label="roleLabel[user.role]"
                size="sm"
              />
            </dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-slate-500">
              E-mail
            </dt>
            <dd class="font-medium text-slate-900">
              {{ user.email }}
            </dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-slate-500">
              Atividades registradas
            </dt>
            <dd class="font-medium text-slate-900">
              {{ user.activityCount }}
            </dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-slate-500">
              Anotações
            </dt>
            <dd class="font-medium text-slate-900">
              {{ user.notesCount }}
            </dd>
          </div>
        </dl>
      </template>
    </div>
  </article>
</template>
